import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './components/settings/settings.component';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CalendarModule, CheckboxModule, InputTextModule, MessageModule,
  MessagesModule, OverlayPanelModule, ScrollPanelModule, TabViewModule,
  ProgressSpinnerModule, ChartModule, InputTextareaModule, TreeTableModule } from 'primeng/primeng';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    InputSwitchModule,
    DropdownModule,
    CardModule,
    TableModule,
    TooltipModule,
    MultiSelectModule,
    ContextMenuModule,
    DialogModule,
    ButtonModule,
    GalleriaModule,
    PanelModule,
    PanelMenuModule,
    FileUploadModule,
    ListboxModule,
    MessagesModule,
    MessageModule,
    TabViewModule,
    ScrollPanelModule,
    DynamicDialogModule,
    CheckboxModule,
    CalendarModule,
    OverlayPanelModule,
    InputTextModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ChartModule,
    InputTextareaModule,
    TreeTableModule,
  ]
})
export class SettingsModule { }
