import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlCollection } from '../url-collection';
import { EntityConfiguration } from '../models/entity-configuration';
import { Observable } from 'rxjs';
import { EntityData } from '../models/entity-data';

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

  createEntity(type: String, data) {
    console.log(type);
    return this.http.post(UrlCollection.Entities.CREATE(), JSON.stringify({type: type, fields: data}));
  }

  updateEntity(type: String, data) {
    return this.http.post(UrlCollection.Entities.UPDATE(), JSON.stringify(data));
  }

  deleteEntity(type: String, id: Number) {
    return this.http.post(UrlCollection.Entities.DELETE(), JSON.stringify({type: type, fields: {id: id}}));
  }
}
