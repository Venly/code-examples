import axios, { AxiosResponse }                                    from 'axios';
import { API_ROOT, BEARER_TOKEN }                                  from './config';
import { EncryptionKey, EncryptionKeysResponse, ResponseEnvelope } from './models';
import { InternalAxiosRequestConfig }                              from 'axios';

export class Api {

    async getEncryptionKeys(): Promise<EncryptionKey[]> {
        const keys = await this.doGet<EncryptionKeysResponse>('/security');
        return keys.encryptionKeys;
    }

    async doGetWithDefaultHeaders<T>(url: string): Promise<T> {
        return this.doGet(url, this.getDefaultHeaders());
    }

    async doGet<T>(url: string,
                   headers?: any): Promise<T> {
        const resp = axios.get<ResponseEnvelope<T>>(API_ROOT + url, headers && {headers})
        return this.processResultAndReturn<T>(resp);
    }

    async doPostWithInterceptor<T>(url: string,
                                   body: any,
                                   interceptor: (cfg: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>) {
        const axiosInstance = axios.create({baseURL: API_ROOT});
        axiosInstance.interceptors.request.use(interceptor);
        const resp = axiosInstance
            .post<ResponseEnvelope<T>>(url, body, {
                headers: this.getDefaultHeaders(),
            })
        return this.processResultAndReturn<T>(resp);
    }


    private async processResultAndReturn<T>(axiosResponse: Promise<AxiosResponse<ResponseEnvelope<T>>>): Promise<T> {
        const resp = await axiosResponse
            .then(r => r.data)
            .catch(err => err.response);
        if (!resp.success) {
            const message = resp.status + ' Api Error';
            console.error(message);
            console.error(resp.data);
            throw message;
        }
        return resp.result;
    }

    private getDefaultHeaders() {
        return {
            Authorization: 'Bearer ' + BEARER_TOKEN,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
    }
}
