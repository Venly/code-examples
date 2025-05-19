import { Chains, Erc20Token, Wallet } from '../common/models';
import { User }                       from '../common/user';
import { Payer }                      from '../common/payer';
import { Eip712 }                     from './eip712';

export class TransactionFlow {
    private user: User;
    private payer: Payer;
    private eip712: Eip712;


    constructor() {
        this.user = new User();
        this.payer = new Payer();
        this.eip712 = new Eip712();
    }

    private chain = Chains.POLYGON_AMOY;
    private userWallet: Wallet = {
        id: '35e0550f-f380-433f-9b2a-b340cc28d37f',
        address: '0xd23087B91c2399dc1AFB337E968EFE9a5081941d',
        signingMethod: {
            id: '147fb60c-a00c-46fe-aef9-8eaf6563d945',
            value: '111111',
        },
    };
    private payerWallet: Wallet = {
        id: 'ac3164cd-6735-43b3-a938-772313ca3ee7',
        address: '0x9Af5c72Aa7E34C3BFa01f4AF5C3c30dE40eDD186',
        signingMethod: {
            id: '147fb60c-a00c-46fe-aef9-8eaf6563d945',
            value: '111111',
        }
    };
    private token: Erc20Token = {
        contract: {
            address: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
            name: 'USDC',
            version: "2"
        },
        decimals: 6,
        amount: 1,
    };
    private toWalletAddress = '0x427d0ADDAa77d8Bb871DBeA3458DeA4B5198730C';

    runFlow(flowType: string | null) {
        switch (flowType) {
            case  'transferWithAuthorization':
                this.testTransferWithAuthorization().then(() => console.log('done'));
                break;
            case 'permitTransferFrom':
                this.permitTransferFrom().then(() => console.log('done'));
                break;
            default:
                throw `Unrecognized flow: ${flowType}`
        }
    }

    private async testTransferWithAuthorization() {
        const eip712Domain = await this.eip712.buildEip712DomainForTransferWithAuthorization(this.chain, this.userWallet, this.token, this.toWalletAddress);
        console.log('EIP712 result:', eip712Domain);

        const eip712Signature = await this.user.signEip712Message(this.chain, this.userWallet, eip712Domain);
        console.log('eip712Signature', eip712Signature);

        const response = await this.payer.executeTransferWithAuthorization(this.chain, this.payerWallet, eip712Domain, eip712Signature);
        console.log('final response', response);
    }

    private async permitTransferFrom() {
        const eip712Domain = await this.eip712.buildEip712DomainForPermitTransfer(this.chain, this.userWallet, this.token, this.payerWallet);
        console.log('EIP712 result:', eip712Domain);

        const eip712Signature = await this.user.signEip712Message(this.chain, this.userWallet, eip712Domain);
        console.log('eip712Signature', eip712Signature);

        const permitResponse = await this.payer.executePermit(this.chain, this.payerWallet, eip712Domain, eip712Signature);
        console.log('permit response', permitResponse);

        const response = await this.payer.executeTransferFrom(
            this.chain, this.payerWallet, eip712Domain, this.toWalletAddress,
            {dependsOnTxHash: permitResponse.transactionHash}
        );
        console.log('transfer response', response);
    }
}
