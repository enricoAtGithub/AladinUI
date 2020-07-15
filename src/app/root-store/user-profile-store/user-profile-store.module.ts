import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { userProfileReducer } from './user-profile.reducers';
import { EffectsModule } from '@ngrx/effects';
import { UserProfileEffects } from './user-profile.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('userProfile', userProfileReducer),
    EffectsModule.forFeature([UserProfileEffects])
  ],
  providers: [UserProfileEffects]
})
export class UserProfileStoreModule { }
