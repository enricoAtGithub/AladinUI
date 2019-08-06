import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlCollection } from '../url-collection';
import { EntityConfiguration } from '../models/entity-configuration';
import { Observable } from 'rxjs';
import { EntityData } from '../models/entity-data';
import { GroupConfiguration } from '../models/group-configuration';
import { GroupMembers } from '../models/group-members';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private http: HttpClient) { }

  // Entities
  getEntityConfigurations(): Observable<EntityConfiguration[]> {
    return this.http.get<EntityConfiguration[]>(UrlCollection.Entities.CONFIGS()); // , httpOptions);
  }

  filter(type: String, page: Number, pageSize: Number, qualifier: String, sorting: String): Observable<EntityData> {
    return this.http.post<EntityData>(UrlCollection.Entities.FILTER(),
      JSON.stringify({type: type, page: page, pageSize: pageSize, qualifier: qualifier, sorting: sorting})); // , httpOptions);
  }

  createEntity(type: String, data) {
    return this.http.post(UrlCollection.Entities.CREATE(), JSON.stringify({type: type, fields: data}));
  }

  updateEntity(type: String, data) {
    return this.http.post(UrlCollection.Entities.UPDATE(), JSON.stringify({type: type, fields: data}));
  }

  deleteEntity(type: String, id: Number) {
    return this.http.post(UrlCollection.Entities.DELETE(), JSON.stringify({type: type, fields: {id: id}}));
  }

  // Groups
  getGroupConfigurations(): Observable<GroupConfiguration[]> {
    return this.http.get<GroupConfiguration[]>(UrlCollection.Groups.CONFIGS()); // , httpOptions);
  }

  membersGroup(type: String, holderId: Number): Observable<GroupMembers> {
    return this.http.post<GroupMembers>(UrlCollection.Groups.MEMBERS(), JSON.stringify({type: type, holderId: holderId}));
  }

  addMember(type: String, holderId: Number, memberId: Number): Observable<Boolean> {
    return this.http.post<Boolean>(UrlCollection.Groups.ADDMEMBER(), JSON.stringify({type: type, holderId: holderId, memberId: memberId}));
  }

  removeMember(type: String, holderId: Number, memberId: Number): Observable<Boolean> {
    return this.http.post<Boolean>(UrlCollection.Groups.REMOVEMEMBER(), JSON.stringify({type: type, holderId: holderId, memberId: memberId}));
  }
}
