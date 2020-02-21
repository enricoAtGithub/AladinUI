import { Component, OnInit, Input } from '@angular/core';
import { FileUploadDownloadService } from '../../services/file-upload-download.service';
import { AttachmentService } from '../../services/attachment.service';
import { ImageService } from '../../services/image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/primeng';

@Component({
  selector: 'app-picture-dialog',
  templateUrl: './picture-dialog.component.html',
  styleUrls: ['./picture-dialog.component.css']
})
export class PictureDialogComponent implements OnInit {

  // @Input() fileId: number;
  // @Input() fileName: string;
  // @Input() attachmentType: string;
  header: string;
  displayImageViewer = false;
  image: any;
  imageIsLoading = true;
  errorOccurred = false;
  fileId: number;

  constructor(
    // private fileService: FileUploadDownloadService,
    // private attachmentService: AttachmentService,
    private imageService: ImageService,
    private _sanitizer: DomSanitizer,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig) { }

  ngOnInit() {
    // this.setHeader();
      this.fileId = this.config.data.fileId;
      console.log('[PictureDialogComponent-ngOnInit] file id: ', this.fileId);
      console.log('[PictureDialogComponent-ngOnInit] loading image');
    this.loadPicture();
  }

  // setHeader() {
  //   if (this.fileName && this.fileName.length > 0) {
  //     this.header = this.fileName;
  //     if (this.attachmentType && this.attachmentType.length > 0) {
  //       this.header += ' - ' + this.attachmentType;
  //     }
  //   } else {
  //     this.header = 'Bildbetrachter';
  //   }
  // }

  loadPicture() {
    this.imageIsLoading = true;

    this.imageService.getImageByFileId(this.fileId).subscribe(imgData => {
      console.log('[PictureDialogComponent-loadPicture] getting image by id, img-data: ', imgData);
      this.createImageFromBlob(imgData);
      this.imageIsLoading = false;
    }, err => {
      console.log('[PictureDialogComponent-loadPicture] error loading image: ', err);
      this.imageIsLoading = false;
      this.errorOccurred = true;
    }
    );

  }


  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const sanitizedImageData = this._sanitizer.bypassSecurityTrustResourceUrl(reader.result.toString());
      console.log('[PictureDialogComponent-createImageFromBlob] sanitized imageData: ', sanitizedImageData);
      this.image = {source: sanitizedImageData, alt: this.header, title: this.header};
      // console.log('img-load-result: ', reader.result.toString().slice(0, 100) + '...');
    }, false);

    if (image) {
       reader.readAsDataURL(image);
    }
 }


}
