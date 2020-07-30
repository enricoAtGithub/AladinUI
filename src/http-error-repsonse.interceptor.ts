import { Injectable} from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorNotificationService } from './app/shared/services/error-notification.service';
import { AuthService } from './app/auth/services/auth.service';
import { Store } from '@ngrx/store';
// import { RootStoreState, UserProfileActions } from 'src/app/root-store/root-index';
import { AuthFacadeService } from './app/auth/services/auth-facade.service';

export enum ServerErrorCode {
    GENERIC_ERROR = 1,
    UNKNOWN_TOKEN = 4,
    LOST_UPDATE_FAILED = 30,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}


@Injectable()
export class HttpErrorRepsonseInterceptor implements HttpInterceptor {

    errorCodeFourBlockActive = false;

    constructor(
        private errorNotificationService: ErrorNotificationService,
        private authService: AuthService,
        private authFacade: AuthFacadeService
        ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError( (error) => {
                console.log(error);
                if (error['status'] === 0) {
                    this.errorNotificationService.addErrorNotification('Could not reach Server!', '');
                } else {
                    /* this block avoids multiple 'invalid token' messages and hides message if user logs out*/
                    if (!!error && !!error.error && !!error.error.code && error.error.code === ServerErrorCode.UNKNOWN_TOKEN) {
                        if (!this.errorCodeFourBlockActive && !req.url.endsWith('/logout')) {
                            this.errorCodeFourBlockActive = true;
                            setTimeout(() => {
                                this.errorCodeFourBlockActive = false;
                            }, 1000);
                            this.errorNotificationService.addErrorNotification('Error code ' + error['error']['code'], error['error']['message']);
                        } else {
                            console.error('Error code ' + error['error']['code'], error['error']['message']);
                        }
                        // if user is logged in, he needs to be logged out and redirected to login
                        if (this.authService.isLoggedIn) {
                            this.authFacade.logout(false);

                        }
                    } else if (!!error && !!error.error && !!error.error.code && error.error.code === ServerErrorCode.LOST_UPDATE_FAILED) {
                        this.errorNotificationService.addErrorNotification(
                            'Update fehlgeschlagen', `Element wurde an anderer Stelle geändert.\n (${error['error']['message']})`);
                    } else {
                        this.errorNotificationService.addErrorNotification('Error code ' + error['error']['code'], error['error']['message']);
                    }

                }
                return throwError(error);
            })
        );
    }
}
