import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import * as userProfileActions from './actions';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';

import { RootStoreState } from '../root-index';
import * as fromConfigSelectors from '../config-store/selectors';
import { ConfigActions } from '../config-store/config-index';

@Injectable()
export class UserProfileEffects {
  constructor(private authService: AuthService, private actions$: Actions, public router: Router, private store$: Store<RootStoreState.State>) {}

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
                const user: User = httpResult.result;

                if (user.user.enforcePasswdChange) {
                  return new userProfileActions.LoginPasswordChangeAction({user: user});
                } else {
                  const redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/dashboard';
                  this.router.navigateByUrl(redirect);
                  return new userProfileActions.LoginSuccessAction({user: httpResult.result});
                }
              }
              // console.log('login failure: ', httpResult.errMsg);
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
    logoutRequestedEffect$ = this.actions$.pipe(
      ofType<userProfileActions.LogoutRequestedAction>(userProfileActions.ActionTypes.LOGOUT_REQUESTED),
      switchMap(action =>
        this.authService.logout(action.payload.sendLogoutRequestToServer)
          .pipe(
            tap(_ => this.router.navigate(['/login'])),
            switchMap(_ => [
              new userProfileActions.LogoutSuccessAction()
            ])
          )
      )
    );

    @Effect()
    loginSuccessEffect$ = this.actions$.pipe(
      ofType<userProfileActions.LoginSuccessAction>(userProfileActions.ActionTypes.LOGIN_SUCCESS),
      switchMap(_ => [new ConfigActions.ConfigsLoadRequestAction(), new ConfigActions.GroupConfigsLoadRequestAction()])
      );
}
