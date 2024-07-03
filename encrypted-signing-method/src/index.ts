import { User }               from './user';
import { SigningMethodInput } from './models';

export function main() {
    testEncryptedSigningMethod()
        .then(() => console.log('done'));
}

async function testEncryptedSigningMethod() {
    // replace with your signing method input
    const signingMethodInput: SigningMethodInput = {
        id: '04b24bf2-a942-40d6-b5d6-bdb8bd660243',
        value: '123456'
    };
    // replace with your transaction request body
    const requestBody = {
        transactionRequest: {
            userId: "8ba38afa-0518-461e-8683-77d415d6a973",
            walletId: "04f21099-85d6-471b-9023-89d80e1d2871",
            to: "0x37A3ffeD4F567D9Bf134f704C4D4D139e18Ae433",
            secretType: "BSC",
            type: "TRANSFER",
            value: "0.01"
        }
    };
    const user = new User();
    user.executeExampleTransferTransaction(signingMethodInput, requestBody)
        .then(res => {
            console.log(res);
        })
}


main();
