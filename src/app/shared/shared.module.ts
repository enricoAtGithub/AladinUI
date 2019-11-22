import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityDialogComponent } from './components/entity-dialog/entity-dialog.component';
import { EntityService } from './services/entity.service';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { EditorModule } from 'primeng/editor';
import { TableModule } from 'primeng/table';
import { FileUploadModule} from 'primeng/fileupload';
import { DialogModule} from 'primeng/dialog';
import { ListboxModule} from 'primeng/listbox';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { FileSaverModule } from 'ngx-filesaver';
import { PickListModule } from 'primeng/picklist';
import { ConfirmDialogModule,
  DropdownModule,
  MultiSelectModule,
  InputTextModule,
  CheckboxModule,
  CalendarModule,
  OverlayPanelModule} from 'primeng/primeng';
import { ErrorNotificationService } from './services/error-notification.service';
import { DynamicTableAttachmentsComponent } from './components/dynamic-table-attachments/dynamic-table-attachments.component';
import { KeyFilterModule } from 'primeng/primeng';
import { FileUploadDialogComponent } from './components/file-upload-dialog/file-upload-dialog.component';
import { CatalogueChooserDialogComponent } from './components/catalogue-chooser-dialog/catalogue-chooser-dialog.component';
import { AttachmentListComponent } from './components/attachment-list/attachment-list.component';
import { AddEntityDialogComponent } from './components/add-entity-dialog/add-entity-dialog.component';
import { EntityLogComponent } from './components/entity-log/entity-log.component';
import { PictureDialogComponent } from './components/picture-dialog/picture-dialog.component';
import { EntityDropdownComponent } from './components/entity-dropdown/entity-dropdown.component';

@NgModule({
  declarations: [
    EntityDialogComponent,
    DynamicTableComponent,
    DynamicTableAttachmentsComponent,
    FileUploadDialogComponent,
    CatalogueChooserDialogComponent,
    AttachmentListComponent,
    AddEntityDialogComponent,
    EntityLogComponent,
    PictureDialogComponent,
    EntityDropdownComponent
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
    KeyFilterModule,
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
    PictureDialogComponent
  ],
  exports: [
    DynamicTableComponent,
    DynamicTableAttachmentsComponent,
    FileUploadDialogComponent,
    AttachmentListComponent,
    CatalogueChooserDialogComponent,
    EntityDropdownComponent
  ],
  providers: [
    EntityService,
    ErrorNotificationService
  ]
})
export class SharedModule { }
