import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionCheckDirective } from './directives/permission-check.directive';



@NgModule({
  declarations: [PermissionCheckDirective],
  imports: [
    CommonModule
  ],
  exports: [PermissionCheckDirective]
})
export class PermissionsModule { }
