import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Catalogue } from '../../models/catalogue';
import { FileUploadDownloadService } from '../../services/file-upload-download.service';
import { FileUploadResult } from '../../models/http/file-upload-result';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AttachmentService } from '../../services/attachment.service';
import { Message } from 'primeng/primeng';
import { AttachmentRequestData } from '../../models/attachment-request-data';

const MAIN_TYPE = 'File';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent implements OnInit {

  @Input() chooseLabel = 'Datei auswählen';
  @Input() uploadLabel = 'Hochladen';
  @Input() cancelLabel = 'Abbrechen';
  @Input() dialogHeader = 'Datei hochladen';

  @Input() catalogueName: string;
  @Input() catalogueDisplayName: string;

  @Input() createAttachment = false;
  // entity to attach file to
  @Input() ownerId: number;
  @Input() ownerType: string;
  // attachment category for entity
  @Input() attachmentCategory: string;

  @Output() fileUploaded = new EventEmitter<FileUploadResult>();
  @Output() error = new EventEmitter<HttpErrorResponse>();
  @Output() fileAttached = new EventEmitter<FileUploadResult>();

  url: string;
  showCatalogChooser = false;
  showFileDialog = false;
  keepOrgFileName = true;
  uploadFileName: string;
  newFileName: string;
  uploadMessages: Message[] = [];


  constructor(private fileService: FileUploadDownloadService, private attachmentService: AttachmentService) { }

  ngOnInit() {
    this.url = this.fileService.getUploadUrl();
  }

  onDlgShow() {}

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
        mainType: MAIN_TYPE,
        mainId: uploadResult.id,
        ownerType: this.ownerType,
        ownerId: this.ownerId,
        attachmentCategory: this.attachmentCategory})
      .subscribe(response => {
        if (response.success) {
          this.uploadMessages.push({severity: 'info', summary: 'Erfolg', detail: 'Datei wurde erfolgreich hochgeladen und verknüpft.'});
          this.fileAttached.emit(uploadResult);
        } else {
          this.uploadMessages.push({severity: 'error', summary: 'Fehler', detail: response.errMsg});
        }
      });
  }


  onButtonClickShowFileDialog() {
    this.showFileDialog = !this.showFileDialog;
  }


// file upload component events

  onBeforeUpload(event: any) {
    console.log('onBeforeUpload');
    const data: FormData = event.formData;
    console.log('[onFileBeforeUpload] selected file', this.newFileName);
    data.append('fileName', this.newFileName);
    data.append('fileType', 'Document');
    console.log('[onFileBeforeUpload] start upload');
  }

  onSend(event: any) {
    console.log('onSend', event);
  }

  onUpload(event: any) {
    console.log('onUpload', event);
    const uploadResult = <FileUploadResult>event.originalEvent.body;
    console.log('upload result', uploadResult);
    // attach
    if (this.createAttachment) {
      this.attachFileToEntity(uploadResult);
    }
    this.fileUploaded.emit(uploadResult);


  }

  onError(event: any) {
    console.log('onError');
    console.log('error: ', event.error);
    this.error.emit(event.error);
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

  }





}
