import { HttpHeaders } from '@angular/common/http';

export interface HttpOptions {
    headers: HttpHeaders;
    observe?: 'body';
}
