import { User }                       from '../common/user';
import { Payer }                      from '../common/payer';
import { Chains, Erc20Token, Wallet } from '../common/models';
import { LegacyEip712 }               from './eip712.legacy';

export class LegacyTransactionFlow {
    private user: User;
    private payer: Payer;
    private eip712: LegacyEip712;

    constructor() {
        this.user = new User();
        this.payer = new Payer();
        this.eip712 = new LegacyEip712();
    }

    private chain = Chains.POLYGON_MAINNET;
    private userWallet: Wallet = {
        id: 'fb791092-d977-4f66-9fc4-eebaa7a2ab0f',
        address: '0xE1984c8942eaF636708e64FeE50d6E8B68e6Ba27',
        signingMethod: { // replace with your signing method
            id: '*****',
            value: '*****',
        }
    };
    private payerWallet: Wallet = {
        id: 'fccdd857-97d5-4b67-abb0-d5820597eb24',
        address: '0x79C76977cb9E5c893cB1324b545E27bCa45eE0Fd',
        signingMethod: { // replace with your signing method
            id: '*****',
            value: '*****',
        }
    };
    private token: Erc20Token = {
        contract: {
            address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            name: 'USD Coin (PoS)',
            version: "1"
        },
        decimals: 6,
        amount: 0.1,
    };
    private toWalletAddress = '0x87Ea861Fd1A58FB08e286a2bF43AFf670E683081';

    runFlow(flowType: string | null) {
        console.warn("----------RUNNING LEGACY FLOW ----------")
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
        console.log('Legacy EIP712 result:', eip712Domain);

        const eip712Signature = await this.user.signEip712Message(this.chain, this.userWallet, eip712Domain);
        console.log('Legacy Eip712Signature', eip712Signature);

        const response = await this.payer.executeTransferWithAuthorization(this.chain, this.payerWallet, eip712Domain, eip712Signature);
        console.log('final response', response);
    }

    private async permitTransferFrom() {
        const eip712Domain = await this.eip712.buildEip712DomainForPermitTransfer(this.chain, this.userWallet, this.token, this.payerWallet);
        console.log('Legacy EIP712 result:', eip712Domain);

        const eip712Signature = await this.user.signEip712Message(this.chain, this.userWallet, eip712Domain);
        console.log('Legacy Eip712Signature', eip712Signature);

        const permitResponse = await this.payer.executePermit(this.chain, this.payerWallet, eip712Domain, eip712Signature);
        console.log('permit response', permitResponse);

        const response = await this.payer.executeTransferFrom(this.chain, this.payerWallet, eip712Domain, this.toWalletAddress);
        console.log('transfer response', response);
    }
}
