import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UrlCollection } from '../url-collection';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getImageByFileId(imageFileId: number): Observable<Blob> {
    return this.getImageByUrl(
      UrlCollection.Files.generateDownloadUrl(imageFileId));
  }

  getImageByUrl(url: string): Observable<Blob> {
    return this.http.get(
      url,
      { responseType: 'blob' });
  }

}
