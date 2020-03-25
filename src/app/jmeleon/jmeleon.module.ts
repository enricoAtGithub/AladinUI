import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramsModule } from './modules/diagrams/diagrams.module';
import { DTOConfigEditorComponent } from './components/dtoconfig-editor/dtoconfig-editor.component';
import { DropdownModule, PanelModule, ButtonModule } from 'primeng/primeng';
import { AceModule } from 'ngx-ace-wrapper';
import { ResourcesComponent } from './components/resources/resources.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DTOConfigEditorComponent, ResourcesComponent],
  imports: [
    CommonModule,
    DiagramsModule,
    DropdownModule,
    AceModule,
    PanelModule,
    ButtonModule,
    SharedModule
  ]
})
export class JmeleonModule { }
