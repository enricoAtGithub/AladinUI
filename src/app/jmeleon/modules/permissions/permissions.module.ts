import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionCheckDirective } from './directives/permission-check.directive';
import { RightActionsEditorComponent } from './components/right-actions-editor/right-actions-editor.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule, ScrollPanelModule, FieldsetModule, 
  ButtonModule, TreeModule, CardModule, ListboxModule, PanelModule } from 'primeng/primeng';



@NgModule({
  declarations: [PermissionCheckDirective, RightActionsEditorComponent],
  imports: [
    CommonModule,
    TreeModule,
    CardModule,
    ListboxModule,
    FormsModule,
    TooltipModule,
    ScrollPanelModule,
    FieldsetModule,
    ButtonModule,
    PanelModule
  ],
  exports: [PermissionCheckDirective, RightActionsEditorComponent]
})
export class PermissionsModule { }
