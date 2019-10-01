import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlCollection } from '../url-collection';
import { EntityConfiguration } from '../models/entity-configuration';
import { Observable, ObservableInput } from 'rxjs';
import { EntityData } from '../models/entity-data';
import { GroupConfiguration } from '../models/group-configuration';
import { GroupMembers } from '../models/group-members';
import { HttpOptionsFactory } from '../models/http/http-options-factory';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private http: HttpClient) { }

  // Entities
  getEntityConfigurations(): Observable<EntityConfiguration[]> {
    return this.http.get<EntityConfiguration[]>(
      UrlCollection.Entities.CONFIGS(),
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  filter(type: String, page: Number, pageSize: Number, qualifier: String, sorting: String): Observable<EntityData> {
    return this.http.post<EntityData>(UrlCollection.Entities.FILTER(),
      JSON.stringify({type: type, page: page, pageSize: pageSize, qualifier: qualifier, sorting: sorting}),
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  getEntityDataFromUrl(path: string): Observable<EntityData> {
    return this.http.get<EntityData>(
      UrlCollection.API_BASE_PATH() + path,
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  createEntity(type: String, data) {
    return this.http.post(UrlCollection.Entities.CREATE(), JSON.stringify({type: type, fields: data}),
    new HttpOptionsFactory()
      // .addAcceptJson()
      .addContentTypeJson()
      .build());
  }

  updateEntity(type: String, id: number, data) {
    return this.http.post(UrlCollection.Entities.UPDATE(),
      JSON.stringify({type: type, fields: data}).replace('"fields":{', '"fields":{"id":' + id + ','),
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  deleteEntity(type: String, id: Number) {
    return this.http.post(UrlCollection.Entities.DELETE(), JSON.stringify({type: type, fields: {id: id}}),
    new HttpOptionsFactory()
      .addAcceptJson()
      .addContentTypeJson()
      .build());
  }

  // Groups
  getGroupConfigurations(): Observable<GroupConfiguration[]> {
    return this.http.get<GroupConfiguration[]>(UrlCollection.Groups.CONFIGS());
  }

  membersGroup(type: String, holderId: Number): Observable<GroupMembers> {
    return this.http.post<GroupMembers>(UrlCollection.Groups.MEMBERS(), JSON.stringify({type: type, holderId: holderId}),
    new HttpOptionsFactory()
      .addAcceptJson()
      .addContentTypeJson()
      .build());
  }

  addMember(type: String, holderId: Number, memberId: Number): Observable<Boolean> {
    return this.http.post<Boolean>(UrlCollection.Groups.ADDMEMBER(), JSON.stringify({type: type, holderId: holderId, memberId: memberId}),
    new HttpOptionsFactory()
      .addAcceptJson()
      .addContentTypeJson()
      .build());
  }

  removeMember(type: String, holderId: Number, memberId: Number): Observable<Boolean> {
    return this.http.post<Boolean>(
      UrlCollection.Groups.REMOVEMEMBER(),
      JSON.stringify({type: type, holderId: holderId, memberId: memberId}),
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  // Entity Attachments
  getAttachments(attachmentType: string, type: string, id: number) {
    return this.http.get(UrlCollection.EntityAttachments.ENTRIES(attachmentType, type, id));
  }

  removeAttachmentEntry(attachmentType: string, id: number) {
    return this.http.post(UrlCollection.EntityAttachments.REMOVE(attachmentType), JSON.stringify({id: id}),
    new HttpOptionsFactory()
      .addAcceptJson()
      .addContentTypeJson()
      .build());
  }

  updateAttachmentEntry(attachmentType: string, attachmentEntry: any) {
    return this.http.post(UrlCollection.EntityAttachments.UPDATE(attachmentType), JSON.stringify(attachmentEntry),
    new HttpOptionsFactory()
      .addAcceptJson()
      .addContentTypeJson()
      .build());
  }

  addAttachmentEntry(attachmentType: string, attachmentEntry: any) {
    return this.http.post(UrlCollection.EntityAttachments.ADD(attachmentType), JSON.stringify(attachmentEntry),
    new HttpOptionsFactory()
      .addAcceptJson()
      .addContentTypeJson()
      .build());
  }
}
