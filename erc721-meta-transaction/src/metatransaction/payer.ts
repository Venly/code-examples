import { Api }                                    from '../api';
import { Chain, Eip712SignatureResponse, Wallet } from './models';

export class Payer {
    private api: Api;

    constructor() {
        this.api = new Api();
    }

    public executeMetaTransaction(chain: Chain,
                                  payerWallet: Wallet,
                                  eip712Domain: any,
                                  eip712Signature: Eip712SignatureResponse) {
        const metaTxRequest = {
            transactionRequest: {
                type: 'CONTRACT_EXECUTION',
                functionName: 'executeMetaTransaction',
                value: 0,
                inputs: [
                    {
                        type: 'address',
                        value: eip712Domain.message.from,
                    },
                    {
                        type: 'bytes',
                        value: eip712Domain.message.functionSignature,
                    },
                    {
                        type: 'bytes32',
                        value: eip712Signature.r,
                    },
                    {
                        type: 'bytes32',
                        value: eip712Signature.s,
                    },
                    {
                        type: 'uint8',
                        value: eip712Signature.v,
                    },
                ],
                walletId: payerWallet.id,
                to: eip712Domain.domain.verifyingContract,
                secretType: chain.secretType,
            },
        };
        return this.api.executeTransaction(metaTxRequest, payerWallet.signingMethod);
    }
}
