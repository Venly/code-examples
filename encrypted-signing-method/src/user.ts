import { SigningMethodInput } from './models';
import { Api }                from './api';
import { SigningMethod }      from './signing-method';

export class User {
    private api: Api;
    private signingMethod: SigningMethod;

    constructor() {
        this.api = new Api();
        this.signingMethod = new SigningMethod();
    }

    public async executeExampleTransferTransaction(sm: SigningMethodInput,
                                                   body: any): Promise<{ transactionHash: string }> {
        return this.api
                   .doPostWithInterceptor<{ transactionHash: string }>(
                       '/transactions',
                       body,
                       async (request) => {
                           const smBody = this.signingMethod.buildSigningMethodRequest(sm, request.data);
                           const encryptedSm = await this.signingMethod.encrypt(smBody);
                           request.headers.set('Encrypted-Signing-Method', this.signingMethod.encode(encryptedSm));
                           return request;
                       }
                   )
    }

}
