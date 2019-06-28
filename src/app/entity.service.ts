import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlCollection } from './shared/url-collection';
import { EntityConfiguration } from './shared/models/entity-configuration';
import { Observable } from 'rxjs';
import { EntityData } from './shared/models/entity-data';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private http: HttpClient) { }

  getEntityConfigurations(): Observable<EntityConfiguration[]> {
    return this.http.get<EntityConfiguration[]>(UrlCollection.Entities.CONFIGS()); // , httpOptions);
  }

  filter(type: String, page: Number, pageSize: Number, qualifier: String, sorting: String): Observable<EntityData> {

    return this.http.post<EntityData>(UrlCollection.Entities.FILTER(),
      JSON.stringify({type: type, page: page, pageSize: pageSize, qualifier: qualifier, sorting: sorting})); // , httpOptions);
  }
}
