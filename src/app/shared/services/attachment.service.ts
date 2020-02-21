import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServiceHelperService } from './service-helper.service';
import { Observable, of } from 'rxjs';
import { HttpResponseState } from '../models/http/http-response-state';
import { UrlCollection } from '../url-collection';
import { map, catchError } from 'rxjs/operators';
import { HttpResult } from '../models/http/http-result';
import { AttachmentResponseData } from '../models/attachment-response-data';
import { AttachmentRequestData } from '../models/attachment-request-data';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(private http: HttpClient, private serviceHelper: ServiceHelperService) { }

  attachToEntity(attachmentData: AttachmentRequestData): Observable<HttpResponseState> {
    return this.http.post(UrlCollection.Attachments.attach(), attachmentData, { observe: 'response' })
    .pipe(
      map(response => {
        console.log('attachment response: ', response);
        return this.serviceHelper.createSuccessResponse();
      }),
      catchError(err =>
        of(this.serviceHelper.createErrorResponse('error creating attachment', err)))
    );
  }

  getAllAttachments(attachmentData: AttachmentRequestData): Observable<HttpResult<AttachmentResponseData>> {

    return this.http.post<AttachmentResponseData>(UrlCollection.Attachments.all(), attachmentData).pipe(
      map(result => this.serviceHelper
        .createSuccessResponseWithContent<AttachmentResponseData>(
          // return real objects
          Object.assign(new AttachmentResponseData(), result))),
      catchError(err =>
        of(this.serviceHelper.createErrorResponseWithContent<AttachmentResponseData>(
          'error getting attachments for entity', err))));
  }

  detachFromEntity(attachmentData: AttachmentRequestData) {

    return this.http.post(UrlCollection.Attachments.attach(), attachmentData)
    .pipe(
      map(() => this.serviceHelper.createSuccessResponse()),
      catchError(err =>
        of(this.serviceHelper.createErrorResponse('error creating catalogue', err)))
    );
  }

  getAllDownloadUrlsForAttachmentData(attachmentResponseData: AttachmentResponseData): string[] {
    return attachmentResponseData.getAllFileIDs().map(id => UrlCollection.Files.download(id));
  }
}
