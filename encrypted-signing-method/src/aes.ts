import { RandomEncryptionResult } from './models';

const {subtle} = globalThis.crypto;

export class AesEncryption {

    private generateRandomIv(): Uint8Array {
        return crypto.getRandomValues(new Uint8Array(12));
    }

    private generateRandomAesGcmKey(alg: string): Promise<CryptoKey> {
        return subtle.generateKey(
            {
                name: alg,
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
    }

    public async encryptWithRandomKey(algorithm: string,
                                      data: string): Promise<RandomEncryptionResult> {
        const iv = this.generateRandomIv();
        const randomAesKey = await this.generateRandomAesGcmKey(algorithm);
        let encrypted = await subtle.encrypt(
            {
                name: algorithm,
                iv
            },
            randomAesKey,
            Buffer.from(data)
        );
        return {
            iv: Buffer.from(iv).toString('base64'),
            key: randomAesKey,
            encryptedData: Buffer.from(encrypted).toString('base64')
        }
    }

}
