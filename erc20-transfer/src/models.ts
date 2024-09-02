export interface SigningMethod {
    id: string,
    value: string
}

export interface Chain {
    id: number;
    secretType: string;
}

export class Chains {
    static readonly POLYGON_AMOY: Chain = {
        id: 80002,
        secretType: 'MATIC',
    };

    static readonly POLYGON_MAINNET: Chain = {
        id: 137,
        secretType: 'MATIC',
    };

    static readonly BASE_SEPOLIA: Chain = {
        id: 84532,
        secretType: 'BASE',
    };
}

export interface Erc20Contract {
    address: string;
    name: string;
}

export interface Wallet {
    id: string;
    address: string;
    signingMethod: SigningMethod;
}

export interface Erc20Token {
    contract: Erc20Contract;
    amount: number;
    decimals: number,
}

export interface Eip712SignatureResponse {
    r: string,
    s: string,
    v: string
}
