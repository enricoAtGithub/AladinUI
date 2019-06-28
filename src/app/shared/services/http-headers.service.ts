import { Injectable } from '@angular/core';

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
}
