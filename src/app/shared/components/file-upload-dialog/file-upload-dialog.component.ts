import { Component, OnInit } from '@angular/core';
import { FileUploadDownloadService } from '../../services/file-upload-download.service';
import { FileUploadResult } from '../../models/http/file-upload-result';
import { AttachmentService } from '../../services/attachment.service';
import { AttachmentRequestData } from '../../models/attachment-request-data';
import { SettingsService } from 'src/app/jmeleon/modules/settings/services/settings.service';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/primeng';

const MAIN_TYPE = 'File';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent implements OnInit {

  chooseLabel = 'Datei auswählen';
  uploadLabel = 'Hochladen';
  cancelLabel = 'Abbrechen';
  catalogueDisplayName: string;
  catalogueName: string;
  fileId: string;

  // entity to attach file to
  ownerId: number;
  ownerType: string;

  // attachment category for entity
  // currently not used within jmeleon frontend but supported by backend attachmentService.
  attachmentCategory: string;

  url: string;
  showCatalogChooser = false;
  showFileDialog = true;
  keepOrgFileName = true;
  uploadFileName: string;
  newFileName: string;
  selectedCatalogueEntry: string;
  maxUploadInByte: number;

  constructor(
    private fileService: FileUploadDownloadService,
    private attachmentService: AttachmentService,
    private settingService: SettingsService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public messageService: MessageService
    ) { }

  ngOnInit() {
    // collect input parameters
    const data = this.config.data;
    this.fileId = data['fileId'];
    this.catalogueName = data ['catalogueName'];
    this.catalogueDisplayName = data['catalogueDisplayName'];
    this.ownerId = data['ownerId'];
    this.ownerType = data['ownerType'];


    this.setMaxUploadSize(1);
    // this.fileId is set in case of updating an existing file => update; if not set => upload
    (this.fileId) ? this.url = this.fileService.getUpdateFileUrl() : this.url = this.fileService.getUploadUrl();

    this.settingService.getMaxUpload().subscribe(maxUploadInMB => this.setMaxUploadSize(maxUploadInMB));
  }

  onDlgShow() {
    this.settingService.getMaxUpload().subscribe(maxUploadInMB => this.setMaxUploadSize(maxUploadInMB));
  }

  setMaxUploadSize(setingInMB) {
    this.maxUploadInByte = setingInMB * 1024 * 1024;
  }

  disableFileNameResetButton(): boolean {
    return this.keepOrgFileName || !this.newFileName && this.newFileName === this.uploadFileName;
  }

  disableKeepFileNameCheckbox(): boolean {
    return !!!this.uploadFileName;
  }

  resetFileName(): void {
    this.newFileName = this.uploadFileName;
  }

  resetFileDialog(): void {
    this.uploadFileName = '';
    this.newFileName = '';
    this.keepOrgFileName = true;
  }

  attachFileToEntity(uploadResult: FileUploadResult) {
    this.attachmentService.attachToEntity(
      <AttachmentRequestData>{
        attachmentType: MAIN_TYPE,
        attachmentId: uploadResult.id,
        ownerType: this.ownerType,
        ownerId: this.ownerId,
        attachmentCategory: this.attachmentCategory})
      .subscribe(response => {
        if (response.success) {
          if (this.fileId) {
            this.messageService.add({severity: 'info', summary: 'Erfolg', detail: `Datei wurde erfolgreich aktualisiert.`});
          } else {
            this.messageService.add({severity: 'info', summary: 'Erfolg', detail: `Datei '${uploadResult.fileName}' wurde erfolgreich hochgeladen und verknüpft.`});
          }
          this.ref.close();
        } else {
          this.messageService.add({severity: 'error', summary: 'Fehler', detail: response.errMsg});
          this.ref.close();
        }
      });
  }

// file upload component events

  onBeforeUpload(event: any) {
    console.log('onBeforeUpload');
    const data: FormData = event.formData;
    console.log('[onFileBeforeUpload] selected file', this.newFileName);
    data.append('fileName', this.newFileName);
    data.append('fileType', this.selectedCatalogueEntry);
    if (this.fileId) { data.append('fileId', this.fileId ); }
    console.log('[onFileBeforeUpload] start upload');
  }

  onSend(event: any) {
    console.log('onSend', event);
  }

  onUpload(event: any) {
    const uploadResult = <FileUploadResult>event.originalEvent.body;

    // if mainId exists attach the uploaded file, otherwise close dialog and return success message
    if (this.ownerId) {
      this.attachFileToEntity(uploadResult);
    } else {
      if (this.fileId) {
        this.messageService.add({severity: 'info', summary: 'Erfolg', detail: `Datei wurde erfolgreich aktualisiert.` });
      } else {
        this.messageService.add({severity: 'info', summary: 'Erfolg', detail: `Datei '${uploadResult.fileName}' wurde erfolgreich hochgeladen.` });
      }
      this.ref.close();
    }
  }

  onError(event: any) {
    this.messageService.add({severity: 'error', summary: 'Fehler', detail: event.error });
    this.ref.close();
  }

  onClear(event: any) {
    console.log('onClear', event);
    this.resetFileDialog();
  }

  onRemove(event: any) {
    console.log('onRemove');
    this.resetFileDialog();
  }

  onSelect(event: any) {
    console.log('onSelect');
    console.log('[onFileSelect] selected file name', event.files[0].name);
    this.uploadFileName = event.files[0].name;
    this.newFileName = this.uploadFileName;
    this.showCatalogChooser = true;
  }

  onProgress(event: any) {
    console.log('onProgress', event);
  }

  onCatalogueItemSelected(event) {
    this.selectedCatalogueEntry = event;
  }

}
