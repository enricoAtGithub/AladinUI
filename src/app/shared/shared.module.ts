import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEntityDialogComponent } from './components/add-entity-dialog/add-entity-dialog.component';
import { EntityService } from './services/entity.service';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule, DropdownModule, MultiSelectModule, InputTextModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    AddEntityDialogComponent,
    DynamicTableComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    InputTextModule
  ],
  entryComponents: [
    AddEntityDialogComponent
  ],
  exports: [
    DynamicTableComponent
  ],
  providers: [
    EntityService
  ]
})
export class SharedModule { }
