import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionCheckDirective } from './directives/permission-check.directive';
import { PermissionCheckTestComponent } from './directives/permission-check-test/permission-check-test.component';



@NgModule({
  declarations: [PermissionCheckDirective, PermissionCheckTestComponent],
  imports: [
    CommonModule
  ]
})
export class PermissionsModule { }
