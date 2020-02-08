import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent implements OnInit {

  @Input() chooseLabel: string;
  @Input() uploadLabel: string;
  @Input() cancelLabel: string;
  url: string;

  constructor() { }

  ngOnInit() {
  }

  onBeforeUpload(event: any) {

  }

  onSend(event: any) {
    console.log('onSend');
  }

  onUpload(event: any) {
    console.log('onUpload');
  }

  onError(event: any) {
    console.log('onError');
  }

  onClear(event: any) {
    console.log('onClear');
  }

  onRemove(event: any) {
    console.log('onRemove');
  }

  onSelect(event: any) {
    console.log('onSelect');
  }

  onProgress(event: any) {
    console.log('onProgress');
  }






}
