import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './components/settings/settings.component';
import { CardModule } from 'primeng/card';



@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    CardModule
  ]
})
export class SettingsModule { }
