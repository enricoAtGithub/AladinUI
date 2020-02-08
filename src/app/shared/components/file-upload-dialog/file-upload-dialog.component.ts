import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Catalogue } from '../../models/catalogue';
import { FileUploadDownloadService } from '../../services/file-upload-download.service';
import { FileUploadResult } from '../../models/http/file-upload-result';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent implements OnInit {

  @Input() chooseLabel = 'Datei auswählen';
  @Input() uploadLabel = 'Hochladen';
  @Input() cancelLabel = 'Abbrechen';

  @Input() attachmentCategory: string;
  @Input() catalogueName: string;

  @Output() fileUploaded = new EventEmitter<FileUploadResult>();
  @Output() error = new EventEmitter<HttpErrorResponse>();

  url: string;
  catalogue: Catalogue;
  showCatalogChooser = false;
  uploadFileName: string;

  constructor(private fileService: FileUploadDownloadService) { }

  ngOnInit() {
    this.catalogue = new Catalogue();
    this.catalogue.name = 'TestCatalogue';
    this.catalogue.values.push('Test01', 'Test02');
    this.url = this.fileService.getUploadUrl();
  }

  onBeforeUpload(event: any) {
    console.log('onBeforeUpload');
    const data: FormData = event.formData;
    console.log('[onFileBeforeUpload] selected file', this.uploadFileName);
    data.append('fileName', this.uploadFileName);
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
    this.fileUploaded.emit(uploadResult);


  }

  onError(event: any) {
    console.log('onError');
    console.log('error: ', event.error);
    this.error.emit(event.error);
    // const xhr: XMLHttpRequest = event.xhr;
    // console.error('Fehler beim Upload: ' + xhr.statusText + '/' + xhr.responseText + '/' + xhr.status + '/' + xhr.readyState);
  }

  onClear(event: any) {
    console.log('onClear', event);
  }

  onRemove(event: any) {
    console.log('onRemove');
  }

  onSelect(event: any) {
    console.log('onSelect');
    // console.log('[onFileSelect] selected files', event.files);
    // console.log('[onFileSelect] selected file', event.files[0]);
    console.log('[onFileSelect] selected file name', event.files[0].name);
    this.uploadFileName = event.files[0].name;
    this.showCatalogChooser = true;
  }

  onProgress(event: any) {
    console.log('onProgress', event);
  }

  onCatalogueItemSelected(event) {

  }





}
