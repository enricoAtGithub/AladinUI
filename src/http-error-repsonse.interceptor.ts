import { Injectable} from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorNotificationService } from './app/shared/services/error-notification.service';
import { ErrorMessage } from './app/shared/models/error-message';
import { AuthService } from './app/auth/services/auth.service';
import { Store } from '@ngrx/store';
import { RootStoreState, UserProfileActions } from 'src/app/root-store/root-index';




@Injectable()
export class HttpErrorRepsonseInterceptor implements HttpInterceptor {

    errorCodeFourBlockActive = false;

    constructor(
        private errorNotificationService: ErrorNotificationService,
        private authService: AuthService,
        private store$: Store<RootStoreState.State>
        ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

          return next.handle(req).pipe(
            catchError( (error) => {
                console.log(error);
                if (error['status'] === 0) {
                    this.errorNotificationService.addErrorNotification(new ErrorMessage('error', 'Could not reach Server!', ''));
                } else {
                    /* this block avoids multiple 'invalid token' messages */
                    if (!!error && !!error.error && !!error.error.code && error.error.code === 4) {
                        if (!this.errorCodeFourBlockActive) {
                            this.errorCodeFourBlockActive = true;
                            setTimeout(() => {
                                this.errorCodeFourBlockActive = false;
                            }, 1000);
                            this.errorNotificationService.addErrorNotification(
                                new ErrorMessage('error', 'Error code ' + error['error']['code'], error['error']['message']));
                        } else {
                            console.error('Error code ' + error['error']['code'], error['error']['message']);
                        }
                        // if user is logged in, he needs to be logged out and redirected to login
                        if (this.authService.isLoggedIn) {
                            this.store$.dispatch(new UserProfileActions.LogoutRequestedAction({sendLogoutRequestToServer: false}));
                        }
                    } else {
                        this.errorNotificationService.addErrorNotification(
                            new ErrorMessage('error', 'Error code ' + error['error']['code'], error['error']['message']));
                    }

                }
                return throwError(error);
          })
        );
    }
}
