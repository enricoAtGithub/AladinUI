import { Injectable } from '@angular/core';
import { RootStoreState, UserProfileActions, UserProfileSelectors, UserProfileState } from 'src/app/root-store/root-index';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {

  userProfileError$: Observable<any>;
  userProfileUser$: Observable<User>;

  constructor(
    private store$: Store<RootStoreState.State>) {

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
}
