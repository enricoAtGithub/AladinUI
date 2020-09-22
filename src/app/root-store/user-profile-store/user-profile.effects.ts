import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, concatMap, withLatestFrom, mergeMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';

import * as ConfigActions from '../config-store/config.actions';
import { JmeleonActionsPermissionService } from 'src/app/jmeleon/modules/permissions/services/jmeleon-actions-permission.service';
import { logoutSucceeded } from './user-profile.actions';
// import { RootStoreState, UserProfileActions } from 'src/app/root-store/root-index';
import * as RootStoreState from '../root.state';
import * as UserProfileActions from './user-profile.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class UserProfileEffects {
  constructor(
    private authService: AuthService,
    private actions$: Actions,
    public router: Router,
    private japs: JmeleonActionsPermissionService,
    private store$: Store<RootStoreState.State>) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProfileActions.loginRequested),
      concatMap(action =>
        this.authService
          .login(action.userName, action.password)
          .pipe(
            map(
              (httpResult) => {
                if (httpResult.success) {
                  const user: User = httpResult.result;
                  user.allowedActions = user.allowedActions.sort();
                  this.japs.initActionsPermittedForCurrentUser(user.allowedActions);

                  if (user.user.enforcePasswdChange) {
                    return UserProfileActions.passwordChangeRequired({user: user});
                  } else {
                    const redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/dashboard';
                    this.router.navigateByUrl(redirect);
                    // return new userProfileActions.LoginSuccessAction({user: httpResult.result});
                    return UserProfileActions.loginSucceeded({user});
                  }
                }
                // console.log('login failure: ', httpResult.errMsg);
                // return new userProfileActions.LoginFailureAction({error: httpResult.errMsg});
                return UserProfileActions.loginFailed({error: httpResult.errMsg});
              }
            ),

            catchError(error =>
              // of(new userProfileActions.LoginFailureAction({ error }))
              of(UserProfileActions.loginFailed({error}))
          )
          )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProfileActions.logoutRequested),
      tap(action => console.log('logout? ', action)),
      switchMap(action =>
        this.authService.logout(action.sendLogoutRequestToServer)
          .pipe(
            tap(_ => this.router.navigate(['/login'])),
            map(_ =>
              logoutSucceeded()
            )
          )
      )
    )
  );

  loginSucceeded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserProfileActions.loginSucceeded),
      switchMap(_ => [ConfigActions.loadConfigsRequested(), ConfigActions.loadGroupConfigsRequested()])

    )
  );

  validateRequested$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserProfileActions.validateTokenRequested),
        withLatestFrom(this.store$),
        mergeMap(([, storeState]) => {
            if (!storeState.userProfile.user || !storeState.userProfile.user.token) {
              return of(UserProfileActions.validateTokenUnnecessary());
            }
            return this.authService.validateToken()
              .pipe(
                tap(result => {
                  if (!result) {
                    this.router.navigate(['/login']);
                  }
                }),
                map(result => result ? UserProfileActions.validateTokenSucceeded() : UserProfileActions.validateTokenFailed())
              );
          }
        )
      )
  );
}
