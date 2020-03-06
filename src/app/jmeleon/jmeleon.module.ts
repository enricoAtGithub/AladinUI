import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramsModule } from './modules/diagrams/diagrams.module';
import { DTOConfigEditorComponent } from './components/dtoconfig-editor/dtoconfig-editor.component';
import { DropdownModule, PanelModule, ButtonModule } from 'primeng/primeng';
import { AceModule } from 'ngx-ace-wrapper';

@NgModule({
  declarations: [DTOConfigEditorComponent],
  imports: [
    CommonModule,
    DiagramsModule,
    DropdownModule,
    AceModule,
    PanelModule,
    ButtonModule
  ]
})
export class JmeleonModule { }
