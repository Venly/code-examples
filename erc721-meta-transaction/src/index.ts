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

    const chain = Chains.BASE_SEPOLIA;
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
            address: '0x675fd9b8a2821196c932aa6906a5cd62f281ac1b',
            name: 'Digimon',
        },
        id: 4,
        amount: 1,
    };
    const toWalletAddress = '0x4cA2A2f943B1BDab80D1AA0985F58a3Df8F92097';

    const eip712Domain = await user.buildEip712DomainForNftTransfer(chain, userWallet, token, toWalletAddress);
    console.log(eip712Domain);

    const eip712Signature = await user.signEip712Message(chain, userWallet, eip712Domain);
    console.log(eip712Signature);

    const response = await payer.executeMetaTransaction(chain, payerWallet, eip712Domain, eip712Signature);
    console.log(response);
}


main();
