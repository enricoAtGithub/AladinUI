import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionCheckDirective } from './directives/permission-check.directive';
import { RightActionsEditorComponent } from './components/right-actions-editor/right-actions-editor.component';



@NgModule({
  declarations: [PermissionCheckDirective, RightActionsEditorComponent],
  imports: [
    CommonModule
  ],
  exports: [PermissionCheckDirective]
})
export class PermissionsModule { }
