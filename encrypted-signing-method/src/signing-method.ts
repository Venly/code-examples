import { createHash, randomUUID }                                                                 from 'crypto';
import { EncryptedSigningMethodRequest, EncryptionKey, SigningMethodInput, SigningMethodRequest } from './models';
import { Api }                                                                                    from './api';
import { AesEncryption }                                                                          from './aes';
import * as assert                                                                                from 'assert';

const {subtle} = globalThis.crypto;

export class SigningMethod {
    private api: Api;
    private aes: AesEncryption;

    constructor() {
        this.api = new Api();
        this.aes = new AesEncryption();
    }

    public buildSigningMethodRequest(sm: SigningMethodInput,
                                     requestBody: any): SigningMethodRequest {
        const sha256Hash = createHash('sha256')
            .update(JSON.stringify(requestBody))
            .digest('base64');
        const idempotencyKey = randomUUID();
        return {
            id: sm.id,
            value: sm.value,
            idempotencyKey,
            signature: {
                type: 'sha256',
                value: sha256Hash
            }
        }
    }

    public async encrypt(signingMethod: SigningMethodRequest): Promise<EncryptedSigningMethodRequest> {
        const key = (await this.api.getEncryptionKeys())[0]; // suggest caching it somewhere
        const encrypted = await this.aes.encryptWithRandomKey('AES-GCM', JSON.stringify(signingMethod));
        const encryptedKey = await this.encryptWithRsa(key, encrypted.key);
        return {
            encryption: {
                type: 'AES/GCM/NoPadding',
                key: {
                    encryptedValue: encryptedKey,
                    encryptionKeyId: key.id
                },
                iv: encrypted.iv
            },
            value: encrypted.encryptedData
        }
    }

    public encode(encryptedSm: EncryptedSigningMethodRequest): string {
        return btoa(JSON.stringify(encryptedSm));
    }


    private async encryptWithRsa(encryptionKey: EncryptionKey,
                                 aesKey: CryptoKey) {
        assert(encryptionKey.encryptionAlgorithm === 'RSAES_OAEP_SHA_256') // this method will work only for this algorithm
        const publicKey = await this.generatePublicKey(encryptionKey);
        const rawAesKey = await subtle.exportKey('raw', aesKey);
        const encrypted = await subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            publicKey,
            rawAesKey
        );
        return Buffer.from(encrypted).toString('base64');
    }

    private generatePublicKey(encryptionKey: EncryptionKey): Promise<CryptoKey> {
        return subtle.importKey(
            "spki",
            Buffer.from(encryptionKey.publicKey, 'base64'),
            {
                name: "RSA-OAEP",
                hash: {name: "SHA-256"},
            },
            true,
            ["encrypt"]
        );
    }
}
