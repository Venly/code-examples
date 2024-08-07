import { Chain, Eip712SignatureResponse, Token, Wallet } from './models';
import { Api }                                           from './api';
import { Utils }                                         from './utils';

export class User {
    private api: Api;

    constructor() {
        this.api = new Api();
    }

    public async signEip712Message(chain: Chain,
                                   userWallet: Wallet,
                                   eip712Domain: any): Promise<Eip712SignatureResponse> {
        const signatureRequest = {
            signatureRequest: {
                type: 'EIP712',
                secretType: chain.secretType,
                walletId: userWallet.id,
                data: eip712Domain,
            },
        };
        return this.api.sign(signatureRequest, userWallet.signingMethod)
                   .then((res: any) => res as Eip712SignatureResponse);
    }

    public async buildEip712DomainForNftTransfer(
        chain: Chain,
        userWallet: Wallet,
        token: Token,
        toWalletAddress: string,
    ): Promise<any> {
        const contract = token.contract;
        const functionSignature = this.generateFunctionSignature(
            userWallet.address!,
            toWalletAddress,
            token.id,
            token.amount,
        );
        const nonce = await this.api.getNonce(
            chain.secretType,
            contract.address,
            userWallet.address!,
        );
        return {
            types: {
                EIP712Domain: [
                    {
                        name: 'name',
                        type: 'string',
                    },
                    {
                        name: 'version',
                        type: 'string',
                    },
                    {
                        name: 'verifyingContract',
                        type: 'address',
                    },
                    {
                        name: 'salt',
                        type: 'bytes32',
                    },
                ],
                MetaTransaction: [
                    {
                        name: 'nonce',
                        type: 'uint256',
                    },
                    {
                        name: 'from',
                        type: 'address',
                    },
                    {
                        name: 'functionSignature',
                        type: 'bytes',
                    },
                ],
            },
            domain: {
                name: contract.name,
                version: '1',
                verifyingContract: contract.address,
                salt: `0x${Utils.leftPad(chain.id.toString(16))}`,
            },
            primaryType: 'MetaTransaction',
            message: {
                nonce: nonce,
                from: userWallet.address,
                functionSignature: functionSignature,
            },
        };
    }

    private generateFunctionSignature(
        sourceWalletAddress: string,
        toWalletAddress: string,
        tokenId: number,
        amount: number,
    ) {
        //generated as mentioned in the docs using JsFiddle here https://jsfiddle.net/nipee/8k14c2wm/6
        const methodId = '0xf242432a';
        const from = Utils.leftPad(sourceWalletAddress.substring(2));
        const to = Utils.leftPad(toWalletAddress.substring(2));
        const tokenIdHex = Utils.leftPad(tokenId.toString(16));
        const amountHex = Utils.leftPad(amount.toString(16));
        const calldataBytes =
            '00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000';
        return methodId + from + to + tokenIdHex + amountHex + calldataBytes;
    }
}
