import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface ApiServiceResult {
    status: boolean;
    content?: any;
}

export interface ApiPayload {
    name: string,
    value: string
}

@Injectable()
export class ApiBaseService {

    protected controller: string;
    protected http: HttpClient;
    protected baseUrl: string = environment.apiUrl;

    constructor(
        injector: Injector
    ) {
        this.http = injector.get(HttpClient);
    }

    protected readonly callPost = (apiMethod: string, params: {}) =>
        this.executeServiceApiCall(apiMethod, 'post', false, params);

    protected readonly callAuthorizedPost = (apiMethod: string, params: {}) =>
        this.executeServiceApiCall(apiMethod, 'post', true, params);

    protected readonly callGet = (apiMethod: string, params?: {}) =>
        this.executeServiceApiCall(apiMethod, 'get', false, params);

    protected readonly callAuthorizedGet = (apiMethod: string, params?: {}) =>
        this.executeServiceApiCall(apiMethod, 'get', true, params);

    private executeServiceApiCall(apiMethod: string, httpMethod: 'post' | 'get', useAuth: boolean, params?: {[key: string]: any}): Observable<ApiServiceResult> {
        const url = `${this.baseUrl}/${this.controller}/${apiMethod}`;

        let headers = new HttpHeaders();
        if (useAuth) {
            const auth = localStorage.getItem('token');
            headers = headers.append('Authorization', `Bearer ${auth ?? ""}`);
        }

        let options: any = {
            responseType: 'text',
            headers,
        };

        let response$: Observable<any>;
        switch (httpMethod)
        {
            case 'get':
                let encodedParameters = params == null ? "" :
                    Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join("&");
                response$ = this.http.get(url + '?' + encodedParameters, options);
                break;

            case 'post':
                for (let key in params) {
                    if (typeof params[key] == 'boolean') {
                        params[key] = params[key] ? 'true' : 'false';
                    }
                }
                response$ = this.http.post(url, params, options);
                break;

            default:
                throw Error(`${httpMethod} is not implemented`);
        }

        let mappedResponse: Observable<ApiServiceResult>;
        mappedResponse = response$.pipe(
            map(response => {
                let content = response;
                if (content != null) {
                    try { content = JSON.parse(content); }
                    catch { throw new Error("Ha ocurrido un error inesperado."); }
                }
                return { status: content == null || content.code > 0, content: content?.body ?? null } as ApiServiceResult;
            }));
        return mappedResponse
            .pipe(
                catchError(x => {
                    return new Observable<ApiServiceResult>(subscriber => {
                        let errorMessage;
                        if (x instanceof HttpErrorResponse) {
                            errorMessage = JSON.parse(x.error).body;
                        } else {
                            errorMessage = x.message;
                        }

                        return subscriber.next({ status: false, content: errorMessage });
                    });
                }));
    }
}