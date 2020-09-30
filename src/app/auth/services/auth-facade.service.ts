import { Injectable } from '@angular/core';
import { RootStoreState, UserProfileActions, UserProfileSelectors } from 'src/app/root-store/root-index';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {

  userProfileError$: Observable<any>;
  userProfileUser$: Observable<User>;

  constructor(
    private store$: Store<RootStoreState.State>,
    public router: Router) {

      this.userProfileError$ = this.store$
      .pipe(select(state => UserProfileSelectors.selectUserProfileError(state)));
      this.userProfileUser$ = this.store$
      .pipe(select(state => UserProfileSelectors.selectUserProfileUser(state)));
    }


    login(userName: string, password: string) {
      this.store$.dispatch(UserProfileActions.loginRequested({userName, password}));
    }

    logout(sendLogoutRequestToServer = false){
      this.store$.dispatch(UserProfileActions.logoutRequested({sendLogoutRequestToServer}));
    }

    validateToken(){
      console.log('validating token');
      this.userProfileUser$
        .pipe(
          // unsubscribe after first result
          take(1)
        )
        .subscribe(
        user =>
        {
          if (!!user && !!user.token){
            this.store$.dispatch(UserProfileActions.validateTokenRequested());
          }
          else{
            this.router.navigate(['/login']);
            console.log('no token stored.');
          }
        }
      )
    }
}
