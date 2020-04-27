import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramsModule } from './modules/diagrams/diagrams.module';
import { DTOConfigEditorComponent } from './components/dtoconfig-editor/dtoconfig-editor.component';
import { DropdownModule, PanelModule, ButtonModule, ScrollPanelModule } from 'primeng/primeng';
import { AceModule } from 'ngx-ace-wrapper';
import { ResourcesComponent } from './components/resources/resources.component';
import { SharedModule } from '../shared/shared.module';
import { DTOEntitiesComponent } from './components/dto-entities/dto-entities.component';

@NgModule({
  declarations: [DTOConfigEditorComponent, ResourcesComponent, DTOEntitiesComponent],
  imports: [
    CommonModule,
    DiagramsModule,
    DropdownModule,
    AceModule,
    PanelModule,
    ButtonModule,
    SharedModule,
    ScrollPanelModule
  ]
})
export class JmeleonModule { }
