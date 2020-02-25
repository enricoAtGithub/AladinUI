import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { userProfileReducer } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { UserProfileEffects } from './effects';

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
