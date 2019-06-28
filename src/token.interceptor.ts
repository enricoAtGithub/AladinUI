import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './app/auth/services/auth.service';
import { Observable } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.method === 'POST') {
        request = request.clone({
            setHeaders: {
                'Content-Type':  'application/json'
            }
        });
    }

    if (this.auth.isLoggedIn && this.auth.localUser && this.auth.localUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: this.auth.localUser.token
                }
            });
            // console.log(`setting auth header to: ${this.auth.localUser.token}`);
        } else {

            // console.log(`no token... current user: ${JSON.stringify(this.auth.localUser)}`);
        }

    return next.handle(request);
  }
}
