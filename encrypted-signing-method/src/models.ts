export interface ResponseEnvelope<T> {
    success: boolean,
    result: T;
}

export interface EncryptionKeysResponse {
    encryptionKeys: EncryptionKey[];
}

export interface EncryptionKey {
    id: string;
    keyspec: string;
    publicKey: string;
    encryptionAlgorithm: string;
}

export interface SigningMethodRequest {
    id: string;
    value: string;
    idempotencyKey: string; //uuid
    signature: {
        type: string;
        value: string
    }
}

export interface EncryptedSigningMethodRequest {
    encryption: {
        type: string;
        key: { encryptedValue: string, encryptionKeyId: string };
        iv: string;
    },
    value: string;
}

export interface RandomEncryptionResult {
    iv: string;
    key: CryptoKey;
    encryptedData: string;
}


export interface SigningMethodInput {
    id: string;
    value: string;
}
