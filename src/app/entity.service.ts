import { Injectable } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlCollection } from './shared/url-collection';
import { EntityConfiguration } from './shared/models/entity-configuration';
import { Observable } from 'rxjs';
import { EntityData } from './shared/models/entity-data';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  getEntityConfigurations(): Observable<EntityConfiguration[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization':  this.authService.localUser.token
      })
    };
    return this.http.get<EntityConfiguration[]>(UrlCollection.Entities.CONFIGS(), httpOptions);
  }

  filter(type: String, page: Number, pageSize: Number, qualifier: String, sorting: String): Observable<EntityData> {
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization':  this.authService.localUser.token,
        'content-type':  'application/json'
      })
    };

    return this.http.post<EntityData>(UrlCollection.Entities.FILTER(),
      JSON.stringify({type: type, page: page, pageSize: pageSize, qualifier: qualifier, sorting: sorting}), httpOptions);
  }
}
