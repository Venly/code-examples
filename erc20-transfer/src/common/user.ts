import { Chain, Eip712SignatureResponse, Erc20Token, Wallet } from './models';
import { Api }                                                from './api';
import { Utils }                                              from './utils';

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

}
