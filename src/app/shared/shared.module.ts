import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityDialogComponent } from './components/entity-dialog/entity-dialog.component';
import { EntityService } from './services/entity.service';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule, DropdownModule, MultiSelectModule, InputTextModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    EntityDialogComponent,
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
    EntityDialogComponent
  ],
  exports: [
    DynamicTableComponent
  ],
  providers: [
    EntityService
  ]
})
export class SharedModule { }
