import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { userProfileReducer, USER_PROFILE_REDUCER } from './user-profile.reducers';
import { EffectsModule } from '@ngrx/effects';
import { UserProfileEffects } from './user-profile.effects';
import * as fromUserProfileState from './user-profile.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // StoreModule.forFeature(fromUserProfileState.userProfileStoreKey, userProfileReducer),
    StoreModule.forFeature(fromUserProfileState.userProfileStoreKey, USER_PROFILE_REDUCER),
    
    EffectsModule.forFeature([UserProfileEffects])
  ],
  providers: [
    UserProfileEffects,
    {
      provide: USER_PROFILE_REDUCER, useValue: userProfileReducer
    }
  ]
})
export class UserProfileStoreModule { }
