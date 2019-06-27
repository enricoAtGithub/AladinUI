import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import * as userProfileActions from './actions';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class UserProfileEffects {
  constructor(private authService: AuthService, private actions$: Actions, public router: Router) {}

  @Effect()
  loginRequestEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userProfileActions.LoginRequestAction>(
      userProfileActions.ActionTypes.LOGIN_REQUEST
    ),
    switchMap(action =>
      this.authService
        .login(action.payload.userName, action.payload.password)
        .pipe(
          map(
            (httpResult, index) => {
              if (httpResult.success) {
                const redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/dashboard';
                this.router.navigateByUrl(redirect);
                return new userProfileActions.LoginSuccessAction({user: httpResult.result});

              }
              console.log('login failure: ', httpResult.errMsg);
              return new userProfileActions.LoginFailureAction({error: httpResult.errMsg});
            }
          ),

          catchError(error =>
            of(new userProfileActions.LoginFailureAction({ error }))
        )
        )
    )
  );

  /* do we communicate logout errors? */
  @Effect()
  logoutRequestedEffect$: Observable<Action> = this.actions$.pipe(
    ofType<userProfileActions.LogoutRequestedAction>(userProfileActions.ActionTypes.LOGOUT_REQUESTED),
    switchMap(() =>
      this.authService.logout()
        .pipe(
          map(([success, errMsg]) => {
            if (!success) {
              // communicate?
              console.log('logout error: ', errMsg);
            }
            this.router.navigate(['/login']);
            return new userProfileActions.LogoutSuccessAction();
          }),
          // communicate?
          catchError(err => {
            console.log('logout error: ', err);
            return of(new userProfileActions.LogoutSuccessAction());
          })
        )
    )
  );
}
