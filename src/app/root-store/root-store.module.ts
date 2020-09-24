import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { UserProfileStoreModule } from './user-profile-store/user-profile-index';
import { StoreModule, ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
// import {UserProfileReducers, UserProfileState} from 'src/app/root-store/user-profile-store/user-profile-index';
// import {RootStoreState} from 'src/app/root-store/root-index';
import * as RootStoreState from './root.state';
import { localStorageSync } from 'ngrx-store-localstorage';
// import { ConfigurationStoreModule, ConfigReducers } from './config-store/config-index';
import { clearState } from './meta-reducers';
import CryptUtils from '../auth/utils/crypt.utils';
import * as UserProfileReducers from '../root-store/user-profile-store/user-profile.reducers';
import * as ConfigReducers from '../root-store/config-store/config.reducer';
import { UserProfileStoreModule } from './user-profile-store/user-profile-store.module';
import { ConfigurationStoreModule } from './config-store/config-store.module';
import { User } from '../shared/models/user';
import { UserProfileState } from './user-profile-store/user-profile.state';


const reducers: ActionReducerMap<RootStoreState.State> = {
  // userProfile: UserProfileReducers.userProfileReducer,
  // config: ConfigReducers.configReducer
  userProfile: UserProfileReducers.publicUserProfileReducer,
  config: ConfigReducers.publicConfigReducer
};

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  const jmeleonStoreNames = [
    {
      'userProfile': {
        encrypt: (state: string) => CryptUtils.encryptForLocalStorage(state),
        decrypt: (state: string) => CryptUtils.decryptForLocalStorage(state),
        serialize: (userState: UserProfileState) => {
          // clone state
          // console.log('serializing state. input: ', userState);
          const state = JSON.parse(JSON.stringify(userState));
          // remove unwanted properties
          if (!!state.user){
            state.user.allowedActions = [];
            state.user.roles = [];
            state.user.user = undefined;
            state.tokenIsValidated = false;
          }
          return state;
          // serialize (doesn't seems to be necessary)
          // console.log('serializing state. ', state);
          // return JSON.stringify(state);
        },
        deserialize: (state) => {

          // console.log('deserializing state. ', state);
          // return JSON.parse(state);
          return state;
        }
      }
    }, {
      'config': {
      }
    }
  ];
  const customStoreNames = [];
  return localStorageSync(
    {
      keys: jmeleonStoreNames.concat(customStoreNames),

      rehydrate: true
    }
    )(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer, clearState];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(
      reducers,
      // undefined,
      {metaReducers}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
    UserProfileStoreModule,
    ConfigurationStoreModule
  ]
})
export class RootStoreModule { }
