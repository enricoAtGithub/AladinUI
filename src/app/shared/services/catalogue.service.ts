import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Catalogue } from '../models/catalogue';
import { UrlCollection } from '../url-collection';
import { HttpResponseState } from '../models/http/http-response-state';
import { map, catchError } from 'rxjs/operators';
import { HttpResult } from '../models/http/http-result';
import { ServiceHelperService } from './service-helper.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  constructor(private http: HttpClient, private serviceHelper: ServiceHelperService) { }

  createCatalogue(catalogueName: string): Observable<HttpResponseState> {
    return this.http.post(UrlCollection.Catalogues.CREATE(), {name: catalogueName})
    .pipe(
      map(() => this.serviceHelper.createSuccessResponse()),
      catchError(err =>
        of(this.serviceHelper.createErrorResponse('error creating catalogue', err)))
    );
  }

  addEntriesToCatalogue(catalogueName: string, entries: string[]): Observable<HttpResponseState> {
    return this.http.post(
        UrlCollection.Catalogues.ADDENTRY(),
        {name: catalogueName, values: entries})
        .pipe(
          map(() => this.serviceHelper.createSuccessResponse()),
          catchError(err =>
            of(this.serviceHelper.createErrorResponse('error adding entries to catalogue', err)))
        );
  }

  getCatalogue(catalogueName: string): Observable<HttpResult<Catalogue>> {
    // console.log('getting catalogue: ', catalogueName);
    return this.http.post<Catalogue>(
        UrlCollection.Catalogues.GET(),
        {name: catalogueName})
        .pipe(
          map(response => this.serviceHelper.createSuccessResponseWithContent<Catalogue>(response)),
          catchError(err =>
            of(this.serviceHelper.createErrorResponseWithContent<Catalogue>
              (`error getting '${catalogueName}' catalogue`, err))));
  }

  getAllCatalogues(): Observable<HttpResult<Catalogue[]>> {
    return this.http.get<Catalogue[]>(UrlCollection.Catalogues.ALL())
      .pipe(
        map(response => this.serviceHelper.createSuccessResponseWithContent<Catalogue[]>(response)),
        catchError(err =>
          of(this.serviceHelper.createErrorResponseWithContent<Catalogue[]>
            ('error getting all catalogues: ', err))));
  }

  removeEntriesFromCatalogue(catalogueName: string, entries: string[]): Observable<HttpResponseState> {
    return this.http.post(
        UrlCollection.Catalogues.REMOVEENTRY(),
        {name: catalogueName, values: entries})
      .pipe(
        map(() => this.serviceHelper.createSuccessResponse()),
        catchError(err =>
          of(this.serviceHelper.createErrorResponse('error removing entries from catalogue', err)))
      );
  }

  deleteCatalogue(catalogueName: string): Observable<HttpResponseState> {
    return this.http.post(UrlCollection.Catalogues.DELETE(), {name: catalogueName})
      .pipe(
        map(() => this.serviceHelper.createSuccessResponse()),
        catchError(err => of(this.serviceHelper.createErrorResponse('error deleting catalogue', err)))
      );
  }
}
