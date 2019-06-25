import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileStoreModule } from './user-profile-store/user-profile-index';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserProfileStoreModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ]
})
export class RootStoreModule { }
