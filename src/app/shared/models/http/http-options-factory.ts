import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from './httpOptions';

export class HttpOptionsFactory {
    headers: HttpHeaders;
    // options: {[key: string]: string};
    options: any;

    constructor() {
        // console.log('new factory');
        this.headers = new HttpHeaders();
        this.options = {};
    }

    addObserveOption(): HttpOptionsFactory {
        this.options.observe = 'response' as 'response';
        return this;
    }

    addContentType(contentType: string): HttpOptionsFactory {
        // console.log(`setting Content-Type to ${contentType}`);
        this.headers = this.headers.append('Content-Type',  contentType);

        // console.log('headers: ', this.headers);
        return this;
    }

    addContentTypeJson(): HttpOptionsFactory {
        return this.addContentType('application/json');
    }

    addAccept(accept: string): HttpOptionsFactory {
        // console.log(`setting Accept to ${accept}`);
        this.headers = this.headers.append('Accept',  accept);
        // console.log('headers: ', this.headers);
        return this;
    }

    addAcceptJson(): HttpOptionsFactory {
        return this.addAccept('application/json');
        // this.addAccept('application/json');
        // return this;
    }

    build() {
        return {
            headers: this.headers
        };
    }

    buildWithObserveOption() {
        return {
            observe: 'response' as 'response',
            headers: this.headers
        };
    }
}
