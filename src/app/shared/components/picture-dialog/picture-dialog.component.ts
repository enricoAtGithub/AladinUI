import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/primeng';

@Component({
  selector: 'app-picture-dialog',
  templateUrl: './picture-dialog.component.html',
  styleUrls: ['./picture-dialog.component.css']
})
export class PictureDialogComponent implements OnInit {

  header: string;
  displayImageViewer = false;
  image: any;
  imageIsLoading = true;
  errorOccurred = false;
  fileId: number;

  constructor(
    private imageService: ImageService,
    private _sanitizer: DomSanitizer,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig) { }

  ngOnInit() {
      this.fileId = this.config.data.fileId;
    this.loadPicture();
  }

  loadPicture() {
    this.imageIsLoading = true;

    this.imageService.getImageByFileId(this.fileId).subscribe(imgData => {
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
      this.image = {source: sanitizedImageData, alt: this.header, title: this.header};
    }, false);

    if (image) {
       reader.readAsDataURL(image);
    }
 }


}
