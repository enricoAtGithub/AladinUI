import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionCheckDirective } from './directives/permission-check.directive';
import { RightActionsEditorComponent } from './components/right-actions-editor/right-actions-editor.component';
import { TreeModule } from 'primeng/tree';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/primeng';



@NgModule({
  declarations: [PermissionCheckDirective, RightActionsEditorComponent],
  imports: [
    CommonModule,
    TreeModule,
    CardModule,
    ListboxModule,
    FormsModule,
    TooltipModule
  ],
  exports: [PermissionCheckDirective, RightActionsEditorComponent]
})
export class PermissionsModule { }
