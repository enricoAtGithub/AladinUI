import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionCheckDirective } from './directives/permission-check.directive';
import { RightActionsEditorComponent } from './components/right-actions-editor/right-actions-editor.component';
import { TreeModule } from 'primeng/tree';
import { CardModule } from 'primeng/card';



@NgModule({
  declarations: [PermissionCheckDirective, RightActionsEditorComponent],
  imports: [
    CommonModule,
    TreeModule,
    CardModule
  ],
  exports: [PermissionCheckDirective, RightActionsEditorComponent]
})
export class PermissionsModule { }
