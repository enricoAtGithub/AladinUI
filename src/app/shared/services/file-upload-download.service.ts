import { UrlCollection } from 'src/app/shared/url-collection';
import { Injectable } from '@angular/core';
import { Subject, Observable, ReplaySubject, BehaviorSubject, of, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { switchMap, map, tap, catchError, share } from 'rxjs/operators';
import { HttpHeadersService } from 'src/app/shared/services/http-headers.service';
import { HttpResult } from 'src/app/shared/models/http/http-result';
import { FileUploadResult } from '../models/http/file-upload-result';

@Injectable({
  providedIn: 'root'
})
export class FileUploadDownloadService {

  constructor(private http: HttpClient) { }

  public getDownloadUrl(fileId: number): string {
    // return UrlCollection.FILE_API_BASE_PATH() + `/download/${fileId}`;
    return UrlCollection.Files.generateDownloadUrl(fileId);
  }

  public getUploadUrl(): string {
    // return UrlCollection.FILE_API_BASE_PATH() + '/upload';
    return UrlCollection.Files.generateUploadUrl();
  }

  public getUpdateFileUrl(): string {
    return UrlCollection.Files.UPDATE();
  }

  public readUploadResult(response: HttpResponse<FileUploadResult>): HttpResult<FileUploadResult> {
    if (response.ok) {
      return {
        success: true,
        result: response.body
      };
    }
    return {
      success: false,
      errMsg: response.statusText
    };
  }

  deleteFile() {

  }

  // don't we have an image service?

  public getImage(imageFileId): Observable<Blob> {
    return this.http.get(this.getDownloadUrl(imageFileId), {responseType: 'blob'});
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
       const imageToShow = reader.result;
       console.log('image to show: ', imageToShow);
    }, false);

    if (image) {
       reader.readAsDataURL(image);
    }
 }

}
