import axios                      from 'axios';
import { API_ROOT, BEARER_TOKEN } from './config';
import { SigningMethod }          from './models';


export class Api {

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
