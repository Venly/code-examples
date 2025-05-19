import { Chain, Erc20Token, Wallet } from '../common/models';
import { Utils }                     from '../common/utils';
import { Api }                       from '../common/api';

export class Eip712 {
    private api: Api;

    constructor() {
        this.api = new Api();
    }

    public async buildEip712DomainForTransferWithAuthorization(
        chain: Chain,
        userWallet: Wallet,
        token: Erc20Token,
        toWalletAddress: string,
    ): Promise<any> {
        const contract = token.contract;
        const amount = Utils.toRawAmount({amount: token.amount, decimals: token.decimals});
        const validBefore = Math.floor((new Date().valueOf() + 3600000) / 1000).toString(); // valid for 1 hr
        const nonce = Utils.randomNonce();
        return {
            types: { // copy the types section as it is
                EIP712Domain: [
                    {
                        name: "name",
                        type: "string"
                    },
                    {
                        name: "version",
                        type: "string"
                    },
                    {
                        name: "chainId",
                        type: "uint256"
                    },
                    {
                        name: "verifyingContract",
                        type: "address"
                    }
                ],
                TransferWithAuthorization: [
                    {
                        name: "from",
                        type: "address"
                    },
                    {
                        name: "to",
                        type: "address"
                    },
                    {
                        name: "value",
                        type: "uint256"
                    },
                    {
                        name: "validAfter",
                        type: "uint256"
                    },
                    {
                        name: "validBefore",
                        type: "uint256"
                    },
                    {
                        name: "nonce",
                        type: "bytes32"
                    }
                ]
            },
            primaryType: "TransferWithAuthorization", // this will be TransferWithAuthorization
            domain: {
                name: contract.name, // name of the ERC20 token contract
                version: contract.version, //version of the contract
                chainId: chain.id, // the chainId
                verifyingContract: contract.address // the ERC20 token contract address
            },
            message: {
                from: userWallet.address, // from wallet address
                to: toWalletAddress, // to wallet address
                value: amount, // value being transferred
                validAfter: "0", // time after which the signed message will be valid
                validBefore: validBefore, // time until the signed message will be valid
                nonce: nonce // random byte32 nonce
            }
        }
    };


    public async buildEip712DomainForPermitTransfer(
        chain: Chain,
        userWallet: Wallet,
        token: Erc20Token,
        payerWallet: Wallet,
    ): Promise<any> {
        const contract = token.contract;
        const amount = Utils.toRawAmount({amount: token.amount, decimals: token.decimals});
        const deadline = Math.floor((new Date().valueOf() + 3600000) / 1000).toString(); // valid for 1 hr
        const nonce = await this.api.getNonce('nonces', chain, contract.address, userWallet.address!);
        return {
            types: { // copy the types section as it is
                EIP712Domain: [
                    {
                        name: "name",
                        type: "string"
                    },
                    {
                        name: "version",
                        type: "string"
                    },
                    {
                        name: "chainId",
                        type: "uint256"
                    },
                    {
                        name: "verifyingContract",
                        type: "address"
                    }
                ],
                Permit: [
                    {
                        name: "owner",
                        type: "address"
                    },
                    {
                        name: "spender",
                        type: "address"
                    },
                    {
                        name: "value",
                        type: "uint256"
                    },
                    {
                        name: "nonce",
                        type: "uint256"
                    },
                    {
                        name: "deadline",
                        type: "uint256"
                    }
                ]
            },
            primaryType: "Permit", // this will be Permit
            domain: {
                name: contract.name, // name of the ERC20 token contract
                version: "2", //version of the contract
                chainId: chain.id, // the chainId
                verifyingContract: contract.address // the ERC20 token contract address
            },
            message: {
                owner: userWallet.address, // from wallet address
                spender: payerWallet.address, // payer wallet address
                value: amount, // value being transferred
                nonce: nonce, // wallet nonce
                deadline: deadline, // time until the signed message will be valid
            }
        }
    };
}
