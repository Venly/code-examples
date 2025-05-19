import { Api }                                    from './api';
import { Chain, Eip712SignatureResponse, Wallet } from './models';
import { Utils }                                  from './utils';

export class Payer {
    private api: Api;

    constructor() {
        this.api = new Api();
    }

    public executeTransferWithAuthorization(chain: Chain,
                                            payerWallet: Wallet,
                                            eip712Domain: any,
                                            eip712Signature: Eip712SignatureResponse) {
        const metaTxRequest = {
            transactionRequest: {
                type: "CONTRACT_EXECUTION",
                functionName: "transferWithAuthorization", // the function name to call
                value: 0.0, // this value will be 0.0
                inputs: [
                    {
                        type: "address", // the from wallet address
                        value: eip712Domain.message.from
                    },
                    {
                        type: "address", // the to wallet address
                        value: eip712Domain.message.to
                    },
                    {
                        type: "uint256", // the amount being transferred
                        value: eip712Domain.message.value
                    },
                    {
                        type: "uint256", // validAfter from the EIP172.message
                        value: eip712Domain.message.validAfter
                    },
                    {
                        type: "uint256", // validBefore from the EIP172.message
                        value: eip712Domain.message.validBefore
                    },
                    {
                        type: "bytes32", // random byte32 nonce from EIP712.message
                        value: eip712Domain.message.nonce
                    },
                    {
                        type: "uint8", // v value from the sign eip712 message response
                        value: eip712Signature.v
                    },
                    {
                        type: "bytes32", // r value from the sign eip712 message response
                        value: eip712Signature.r
                    },
                    {
                        type: "bytes32", // s value from the sign eip712 message response
                        value: eip712Signature.s
                    }
                ],
                walletId: payerWallet.id, // the wallet ID of the PAYER WALLET (who will pay the gas fee)
                to: eip712Domain.domain.verifyingContract, // the token contract address for which we want to do a transfer
                secretType: chain.secretType // blockchain of the tx
            }
        };
        return this.api.executeTransaction(metaTxRequest, payerWallet.signingMethod);
    }


    public executePermit(chain: Chain,
                         payerWallet: Wallet,
                         eip712Domain: any,
                         eip712Signature: Eip712SignatureResponse) {
        const metaTxRequest = {
            transactionRequest: {
                type: "CONTRACT_EXECUTION",
                functionName: "permit", // the function name to call
                value: 0.0, // this value will be 0.0
                inputs: [
                    {
                        type: "address", // the from wallet address
                        value: eip712Domain.message.owner
                    },
                    {
                        type: "address", // the payer wallet address
                        value: eip712Domain.message.spender
                    },
                    {
                        type: "uint256", // the amount being transferred
                        value: eip712Domain.message.value
                    },
                    {
                        type: "uint256", // deadline from the EIP172.message
                        value: eip712Domain.message.deadline
                    },
                    {
                        type: "uint8", // v value from the sign eip712 message response
                        value: eip712Signature.v
                    },
                    {
                        type: "bytes32", // r value from the sign eip712 message response
                        value: eip712Signature.r
                    },
                    {
                        type: "bytes32", // s value from the sign eip712 message response
                        value: eip712Signature.s
                    }
                ],
                walletId: payerWallet.id, // the wallet ID of the PAYER WALLET (who will pay the gas fee)
                to: eip712Domain.domain.verifyingContract, // the token contract address for which we want to do a transfer
                secretType: chain.secretType // blockchain of the tx
            }
        };
        return this.api.executeTransaction(metaTxRequest, payerWallet.signingMethod);
    }

    public async executeTransferFrom(chain: Chain,
                                     payerWallet: Wallet,
                                     eip712Domain: any,
                                     toWalletAddress: string,
                                     options?: { dependsOnTxHash?: string }): Promise<any> {
        if (options?.dependsOnTxHash) {
            console.log('Waiting for transaction to confirm....')
            const status = await this.api.getTxStatus(chain, options.dependsOnTxHash);
            if (status === 'PENDING' || status === 'UNKNOWN') {
                await Utils.wait(2000); //wait 2 seconds between status checks
                return this.executeTransferFrom(chain, payerWallet, eip712Domain, toWalletAddress, options);
            }
            if (status === 'FAILED') {
                throw `Depending transaction ${options.dependsOnTxHash} failed. Stopping execution`;
            }

        }
        const metaTxRequest = {
            transactionRequest: {
                type: "CONTRACT_EXECUTION",
                functionName: "transferFrom", // the function name to call
                value: 0.0, // this value will be 0.0
                inputs: [
                    {
                        "type": "address", // the from address (User Wallet)
                        "value": eip712Domain.message.owner
                    },
                    {
                        "type": "address", // the to address (where the tokens will be sent to)
                        "value": toWalletAddress,
                    },
                    {
                        "type": "uint256", // the amount being transferred
                        "value": eip712Domain.message.value
                    }
                ],
                walletId: payerWallet.id, // the wallet ID of the PAYER WALLET (who will pay the gas fee)
                to: eip712Domain.domain.verifyingContract, // the token contract address for which we want to do a transfer
                secretType: chain.secretType // blockchain of the tx
            }
        };
        return this.api.executeTransaction(metaTxRequest, payerWallet.signingMethod);
    }
}
