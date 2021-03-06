import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramsModule } from './modules/diagrams/diagrams.module';
import { DTOConfigEditorComponent } from './components/dtoconfig-editor/dtoconfig-editor.component';
import { DropdownModule, PanelModule, ButtonModule, ScrollPanelModule, DynamicDialogConfig } from 'primeng/primeng';
import { AceModule } from 'ngx-ace-wrapper';
import { SharedModule } from '../shared/shared.module';
import { DTOEntitiesComponent } from './components/dto-entities/dto-entities.component';
import { ListboxModule } from 'primeng/listbox';
import { ScriptActionsComponent } from './components/script-actions/script-actions.component';
import { ScriptResultComponent } from './components/script-result/script-result.component';

@NgModule({
  declarations: [DTOConfigEditorComponent, DTOEntitiesComponent, ScriptActionsComponent, ScriptResultComponent],
  imports: [
    CommonModule,
    DiagramsModule,
    DropdownModule,
    AceModule,
    PanelModule,
    ButtonModule,
    SharedModule,
    ScrollPanelModule,
    ListboxModule,
  ],
  entryComponents: [
    ScriptResultComponent
  ],
  providers: [
    DynamicDialogConfig
],
})
export class JmeleonModule { }
