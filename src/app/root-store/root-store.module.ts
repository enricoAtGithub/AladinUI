import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileStoreModule } from './user-profile-store/user-profile-index';
import { StoreModule, ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import {UserProfileReducers, UserProfileState} from 'src/app/root-store/user-profile-store/user-profile-index';
import {RootStoreState} from 'src/app/root-store/root-index';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ConfigurationStoreModule, ConfigReducers } from './config-store/config-index';
import { clearState } from './meta-reducers';


const reducers: ActionReducerMap<RootStoreState.State> = {
  userProfile: UserProfileReducers.userProfileReducer,
  config: ConfigReducers.configReducer
};

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  const jmeleonStoreNames: string[] = ['userProfile', 'config'];
  const customStoreNames: string[] = [];
  return localStorageSync({keys: jmeleonStoreNames.concat(customStoreNames), rehydrate: true})(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer, clearState];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
    UserProfileStoreModule,
    ConfigurationStoreModule
  ]
})
export class RootStoreModule { }
