import axios                      from 'axios';
import { Chain, SigningMethod }   from './models';
import { API_ROOT, BEARER_TOKEN } from '../config';


export class Api {
    async getNonce(functionName: string,
                   chain: Chain,
                   contractAddress: string,
                   walletAddress: string): Promise<any> {
        const getNonceRequest = {
            secretType: chain.secretType,
            contractAddress: contractAddress,
            functionName: functionName,
            inputs: [
                {
                    type: 'address',
                    value: walletAddress,
                },
            ],
            outputs: [
                {
                    type: 'uint256',
                },
            ],
        };
        console.log('Executing POST /contracts/read (to get nonce):', getNonceRequest)
        const res = await this.doPost('/contracts/read', getNonceRequest);
        return res[0].value;
    }

    async sign(signatureRequest: any,
               signingMethod: SigningMethod) {
        console.log('Executing POST /signatures:', signatureRequest, signingMethod)
        return await this.doPost('/signatures', signatureRequest, signingMethod);
    }

    async executeTransaction(transactionRequest: any,
                             signingMethod: SigningMethod): Promise<{ transactionHash: string }> {
        console.log('Executing POST /transactions:', transactionRequest, signingMethod)
        return await this.doPost('/transactions', transactionRequest, signingMethod);
    }

    async doPost(url: string,
                 body: any,
                 signingMethod?: SigningMethod): Promise<any> {
        let headers: any = {
            Authorization: 'Bearer ' + BEARER_TOKEN,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
        if (signingMethod) {
            headers['Signing-Method'] = `${signingMethod?.id}:${signingMethod?.value}`;
        }
        const resp = await axios
            .post(API_ROOT + url, body, {headers})
            .then(resp => resp.data)
            .catch(err => err.response);
        if (!resp.success) {
            const message = resp.status + ' Api Error';
            console.error(message);
            console.error(resp.data);
            throw message;
        }
        return resp.result;
    }
}
