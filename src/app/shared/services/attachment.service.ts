import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServiceHelperService } from './service-helper.service';
import { Observable, of } from 'rxjs';
import { HttpResponseState } from '../models/http/http-response-state';
import { UrlCollection } from '../url-collection';
import { map, catchError } from 'rxjs/operators';
import { HttpResult } from '../models/http/http-result';
import { AttachmentData } from '../models/attachment-data';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(private http: HttpClient, private serviceHelper: ServiceHelperService) { }

  attachToEntity(
    mainType: string,
    mainId: number,
    ownerType: string,
    ownerId: number,
    attachmentCategory: string):
    Observable<HttpResponseState> {

    return this.http.post(UrlCollection.Attachments.attach(), {
      mainType,
      mainId,
      ownerType,
      ownerId,
      attachmentCategory
    })
    .pipe(
      // map(() => this.serviceHelper.createSuccessResponse()),
      map(response => {
        console.log('attachment response: ', response);
        return this.serviceHelper.createSuccessResponse();
      }),
      catchError(err =>
        of(this.serviceHelper.createErrorResponse('error creating attachment', err)))
    );
  }

  getAllAttachments(
    mainType: string,
    ownerType: string,
    ownerId: number): Observable<HttpResult<AttachmentData>> {

    return this.http.post<AttachmentData>(UrlCollection.Attachments.all(), {
      mainType,
      ownerType,
      ownerId
    }).pipe(
      map(result => this.serviceHelper.createSuccessResponseWithContent<AttachmentData>(result)),
      catchError(err =>
        of(this.serviceHelper.createErrorResponseWithContent<AttachmentData>(
          'error getting attachments for entity', err))));
  }

  detachFromEntity(
    mainType: string,
    mainId: number,
    ownerType: string,
    ownerId: number) {

      return this.http.post(UrlCollection.Attachments.attach(), {
        mainType,
        mainId,
        ownerType,
        ownerId
      })
      .pipe(
        map(() => this.serviceHelper.createSuccessResponse()),
        catchError(err =>
          of(this.serviceHelper.createErrorResponse('error creating catalogue', err)))
      );
    }
}
