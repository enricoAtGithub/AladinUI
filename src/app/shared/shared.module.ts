import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityDialogComponent } from './components/entity-dialog/entity-dialog.component';
import { EntityService } from './services/entity.service';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {
  ConfirmDialogModule,
  DropdownModule,
  MultiSelectModule,
  InputTextModule,
  CheckboxModule,
  CalendarModule,
  TabViewModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { PickListModule } from 'primeng/picklist';
import { ErrorNotificationService } from './services/error-notification.service';
import { DynamicTableAttachmentsComponent } from './components/dynamic-table-attachments/dynamic-table-attachments.component';

@NgModule({
  declarations: [
    EntityDialogComponent,
    DynamicTableComponent,
    DynamicTableAttachmentsComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    InputTextModule,
    PickListModule,
    CheckboxModule,
    CalendarModule,
    TabViewModule,
  ],
  entryComponents: [
    EntityDialogComponent
  ],
  exports: [
    DynamicTableComponent
  ],
  providers: [
    EntityService,
    ErrorNotificationService
  ]
})
export class SharedModule { }
