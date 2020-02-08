import { UrlCollection } from 'src/app/shared/url-collection';
import { Injectable } from '@angular/core';
import { Subject, Observable, ReplaySubject, BehaviorSubject, of, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { switchMap, map, tap, catchError, share } from 'rxjs/operators';
import { HttpHeadersService } from 'src/app/shared/services/http-headers.service';
import { HttpResult } from 'src/app/shared/models/http/http-result';

@Injectable({
  providedIn: 'root'
})
export class FileUploadDownloadService {

  constructor(private http: HttpClient) { }

  public getDownloadUrl(fileId: number): string {
    return UrlCollection.FILE_API_BASE_PATH() + `/download/${fileId}`;
  }

  public getUploadUrl(): string {
    return UrlCollection.FILE_API_BASE_PATH() + '/upload';
  }

}
