import { Injectable} from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorNotificationService } from './app/shared/services/error-notification.service';
import { ErrorMessage } from './app/shared/models/error-message';

@Injectable()
export class HttpErrorRepsonseInterceptor implements HttpInterceptor {
    constructor(private errorNotificationService: ErrorNotificationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

          return next.handle(req).pipe(
            catchError( (error) => {
                if (error['status'] === 0) {
                    this.errorNotificationService.addErrorNotification(new ErrorMessage('error', 'Could not reach Server!', ''));
                } else {
                    this.errorNotificationService.addErrorNotification(
                        new ErrorMessage('error', 'Error code ' + error['error']['code'], error['error']['message']));
                }
                return throwError(error);
          })
        );
    }
}
