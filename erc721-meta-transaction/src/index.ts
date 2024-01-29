import { Chains, Token, Wallet } from './models';
import { User }                  from './user';
import { Payer }                 from './payer';

export function main() {
    testMetaTransactionNftTransfer()
        .then(() => console.log('done'));
}

async function testMetaTransactionNftTransfer() {
    const user = new User();
    const payer = new Payer();

    const chain = Chains.POLYGON_TESTNET;
    const userWallet: Wallet = {
        id: '35e0550f-f380-433f-9b2a-b340cc28d37f',
        address: '0xd23087B91c2399dc1AFB337E968EFE9a5081941d',
        signingMethod: {
            id: '147fb60c-a00c-46fe-aef9-8eaf6563d945',
            value: '111111',
        },
    };
    const payerWallet: Wallet = {
        id: '35e0550f-f380-433f-9b2a-b340cc28d37f',
        signingMethod: {
            id: '147fb60c-a00c-46fe-aef9-8eaf6563d945',
            value: '111111',
        }
    };
    const token: Token = {
        contract: {
            address: '0x80E64e1AAa57034CA0561288449B2FE9687a94a8',
            name: 'Classic Cars',
        },
        id: 25,
        amount: 1,
    };
    const toWalletAddress = '0x3C7f7Fda33Dc8716A58a691165269998A6A61B5F';

    const eip712Domain = await user.buildEip712DomainForNftTransfer(chain, userWallet, token, toWalletAddress);
    const eip712Signature = await user.signEip712Message(chain, userWallet, eip712Domain);
    const response = await payer.executeMetaTransaction(chain, payerWallet, eip712Domain, eip712Signature);

    console.log(response);
}


main();
