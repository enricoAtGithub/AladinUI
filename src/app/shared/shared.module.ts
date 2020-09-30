import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityDialogComponent } from './components/entity-dialog/entity-dialog.component';
import { EntityService } from './services/entity.service';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { FileUploadDialogComponent } from './components/file-upload-dialog/file-upload-dialog.component';
import { CatalogueChooserDialogComponent } from './components/catalogue-chooser-dialog/catalogue-chooser-dialog.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { AttachmentListComponent } from './components/attachment-list/attachment-list.component';
import { FileSaverModule } from 'ngx-filesaver';
import { PickListModule } from 'primeng/picklist';
import { ErrorNotificationService } from './services/error-notification.service';
import { DynamicTableAttachmentsComponent } from './components/dynamic-table-attachments/dynamic-table-attachments.component';
import { PictureDialogComponent } from './components/picture-dialog/picture-dialog.component';
import { EntityDropdownComponent } from './components/entity-dropdown/entity-dropdown.component';
import { KeyFilterModule, ScrollPanelModule } from 'primeng/primeng';
import { ColorPickerModule } from 'primeng/colorpicker';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PermissionsModule } from '../jmeleon/modules/permissions/permissions.module';
import { EntityNotesComponent } from './components/entity-attachments/entity-notes/entity-notes.component';
import { EntityAttributesComponent } from './components/entity-attachments/entity-attributes/entity-attributes.component';
import { EntityGroupRelationComponent } from './components/entity-attachments/entity-group-relation/entity-group-relation.component';
import { EntityFileAttachmentsComponent } from './components/entity-attachments/entity-file-attachments/entity-file-attachments.component';
import { EntityLogsComponent } from './components/entity-attachments/entity-logs/entity-logs.component';
import { EntitySubtypesComponent } from './components/entity-attachments/entity-subtypes/entity-subtypes.component';
import { IconPickerModule } from 'ngx-icon-picker';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { PanelModule } from 'primeng/panel';
import { AceModule } from 'ngx-ace-wrapper';
import { VarDirective } from './directives/var.directive';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { PasswordInputComponent } from './components/password-input/password-input.component';
import { EntityViewComponent } from './components/entity-view/entity-view.component';
import { StopClickPropagationDirective } from './directives/stop-click-propagation.directive';

@NgModule({
  declarations: [
    EntityDialogComponent,
    DynamicTableComponent,
    DynamicTableAttachmentsComponent,
    FileUploadDialogComponent,
    CatalogueChooserDialogComponent,
    AttachmentListComponent,
    PictureDialogComponent,
    EntityDropdownComponent,
    EntityNotesComponent,
    EntityAttributesComponent,
    EntityGroupRelationComponent,
    EntityFileAttachmentsComponent,
    EntityLogsComponent,
    EntitySubtypesComponent,
    CodeEditorComponent,
    VarDirective,
    AutoFocusDirective,
    PasswordInputComponent,
    EntityViewComponent,
    StopClickPropagationDirective
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
    EditorModule,
    ColorPickerModule,
    TooltipModule,
    NgxPermissionsModule.forChild({
      permissionsIsolate: false,
      rolesIsolate: false
    }),
    PermissionsModule,
    ScrollPanelModule,
    IconPickerModule,
    ReactiveFormsModule,
    PanelModule,
    AceModule,
    RouterModule
  ],
  entryComponents: [
    EntityDialogComponent,
    PictureDialogComponent,
    CodeEditorComponent, 
    FileUploadDialogComponent
  ],
  exports: [
    DynamicTableComponent,
    DynamicTableAttachmentsComponent,
    FileUploadDialogComponent,
    AttachmentListComponent,
    CatalogueChooserDialogComponent,
    EntityDropdownComponent,
    NgxPermissionsModule,
    PermissionsModule,
    PasswordInputComponent
  ],
  providers: [
    EntityService,
    ErrorNotificationService
  ]
})
export class SharedModule { }
