import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileStoreModule } from './user-profile-store/user-profile-store.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserProfileStoreModule
  ]
})
export class RootStoreModule { }
