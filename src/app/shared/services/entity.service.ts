import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlCollection } from '../url-collection';
import { EntityConfiguration } from '../models/entity-configuration';
import { Observable } from 'rxjs';
import { EntityData, Entity } from '../models/entity-data';
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

  getEntityConfigurationFile(configName: string): Observable<Object> {
    return this.http.get(
      UrlCollection.Entities.CONFIG_FILE(configName),
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  updateEntityConfigurationFile(configName: string, config: string) {
    return this.http.post(
      UrlCollection.Entities.CONFIG_FILE(configName),
      { content: config },
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  getEntity(type: string, id: number): Observable<Entity> {
    return this.http.get<Entity>(UrlCollection.Entities.GET(type, id),
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  filter(type: String, page: Number, pageSize: Number, mainId: number, qualifier: String, sorting: String): Observable<EntityData> {
    return this.http.post<EntityData>(UrlCollection.Entities.FILTER(),
      { type: type, page: page, pageSize: pageSize, mainId: mainId, qualifier: qualifier, sorting: sorting },
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

  postEntityDataFromUrl(path: string, data: any): Observable<EntityData> {
    return this.http.post<EntityData>(
      UrlCollection.API_BASE_PATH() + path, data,
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  createEntity(type: String, data) {
    return this.http.post(UrlCollection.Entities.CREATE(), { type: type, fields: data },
      new HttpOptionsFactory()
        // .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  updateEntity(type: String, id: number, data): Observable<Entity> {
    return this.http.post<Entity>(
      UrlCollection.Entities.UPDATE(),
      { type: type, fields: { ...data, ...{ 'id': id } } },
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  deleteEntity(type: String, id: Number) {
    return this.http.post(UrlCollection.Entities.DELETE(), { type: type, fields: { id: id } },
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
    return this.http.post<GroupMembers>(UrlCollection.Groups.MEMBERS(), { type: type, holderId: holderId },
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  addMember(type: String, holderId: Number, memberId: Number): Observable<Boolean> {
    return this.http.post<Boolean>(UrlCollection.Groups.ADDMEMBER(), { type: type, holderId: holderId, memberId: memberId },
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  removeMember(type: String, holderId: Number, memberId: Number): Observable<Boolean> {
    return this.http.post<Boolean>(
      UrlCollection.Groups.REMOVEMEMBER(),
      { type: type, holderId: holderId, memberId: memberId },
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  // Entity Attachments
  getAttachments(attachmentType: string, type: string, id: number) {
    return this.http.get(UrlCollection.EntityAttachments.ENTRIES(attachmentType, type, id),
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  getAttributes(type: string, id: number, attrGroup?: string) {
    return this.http.get(UrlCollection.EntityAttributes.ENTRIES(type, id, attrGroup),
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  removeAttachmentEntry(attachmentType: string, id: number) {
    return this.http.post(UrlCollection.EntityAttachments.REMOVE(attachmentType), { id: id },
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  updateAttachmentEntry(attachmentType: string, attachmentEntry: any) {
    return this.http.post(UrlCollection.EntityAttachments.UPDATE(attachmentType), attachmentEntry,
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  addAttachmentEntry(attachmentType: string, attachmentEntry: any) {
    return this.http.post(UrlCollection.EntityAttachments.ADD(attachmentType), attachmentEntry,
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  updateAttribute(attachmentEntry: any) {
    return this.http.post(UrlCollection.EntityAttributes.UPDATE(), attachmentEntry,
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  addAttribute(attachmentEntry: any) {
    return this.http.post(UrlCollection.EntityAttributes.ADD(), attachmentEntry,
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  removeAttribute(id: number) {
    return this.http.post(UrlCollection.EntityAttributes.REMOVE(), { id: id },
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  eval(expression: string) {
    return this.http.post(UrlCollection.EVAL(), { expression: expression },
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  // Action script execution
  getAction(payload: Object) {
    return this.http.post(UrlCollection.Actions.GETACTION(), payload,
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  executeAction(payload: Object, asnyc: boolean) {
    return this.http.post(UrlCollection.Actions.EXECUTE(), payload,
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  executeCodeSnippet(payload: Object) {
    return this.http.post(UrlCollection.Actions.EXECUTESNIPPET(), payload,
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

}
