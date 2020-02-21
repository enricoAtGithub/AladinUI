import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HttpHeadersService {
    constructor() {

    }

    getObserveHttpOption() { // :Object {
        return {
            observe: 'response' as 'response'
        };
    }

    getHttpOptions(header: HttpHeaders = null, observe = false): any {
        const httpOptions: any = {};
        if (observe) {
            httpOptions.observe = 'response' as 'response';
        }
        if (header) {
            httpOptions.headers = header;
        }
        return httpOptions;
    }

    addContentType(headers: HttpHeaders, contentType: string): HttpHeaders {
    headers = this.checkHeaderObj(headers);
    headers.append('Content-Type',  contentType);
    return headers;
    }

    addContentTypeJson(headers: HttpHeaders): HttpHeaders  {
    return this.addContentType(headers, 'application/json');
    }

    addAccept(headers: HttpHeaders, accept: string): HttpHeaders {
    headers = this.checkHeaderObj(headers);
    headers.append('Accept',  accept);
    return headers;
    }

    addAcceptJson(headers: HttpHeaders): HttpHeaders  {
    return this.addAccept(headers, 'application/json');
    }



    defaultPostHeader(): HttpHeaders {
    return this.addContentTypeJson(null);
    }

    defaultGetHeader(): HttpHeaders {
    return this.addAcceptJson(null);
    }

    // private checkHeaderObj(headers: HttpHeaders): HttpHeaders {
    //   if (!headers) {
    //     return new HttpHeaders();
    //   }
    //   return headers;
    // }

    private checkHeaderObj = (headers: HttpHeaders): HttpHeaders => !!headers ? headers : new HttpHeaders;
}
