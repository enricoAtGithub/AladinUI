import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityDialogComponent } from './components/entity-dialog/entity-dialog.component';
import { EntityService } from './services/entity.service';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { EditorModule } from 'primeng/editor';
import { TableModule } from 'primeng/table';
import { FileUploadModule} from 'primeng/fileupload';
import { DialogModule} from 'primeng/dialog';
import { ListboxModule} from 'primeng/listbox';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { FileSaverModule } from 'ngx-filesaver';
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
    FileUploadModule,
    DialogModule,
    ListboxModule,
    MessagesModule,
    MessageModule,
    CheckboxModule,
    CalendarModule,
    TabViewModule,
    FileSaverModule,
    PickListModule,
    OverlayPanelModule,
    EditorModule
  ],
  entryComponents: [
    EntityDialogComponent,
  ],
  exports: [
    DynamicTableComponent,
    DynamicTableAttachmentsComponent,
  ],
  providers: [
    EntityService,
    ErrorNotificationService
  ]
})
export class SharedModule { }
