import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from './components/diagram/diagram.component';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule, PanelModule } from 'primeng/primeng';



@NgModule({
  declarations: [
    DiagramComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    ProgressSpinnerModule,
    PanelModule
  ],
  exports: [
    DiagramComponent
  ]
})
export class DiagramsModule { }
