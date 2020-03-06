import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Catalogue } from 'src/app/shared/models/catalogue';
import { UrlCollection } from 'src/app/shared/url-collection';
import { TreeNode } from 'primeng/primeng';
import { HttpOptionsFactory } from 'src/app/shared/models/http/http-options-factory';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  constructor(private httpClient: HttpClient) { }

  getAllCatalogues(): Promise<TreeNode[]> {
    return this.httpClient.get<any>(
      UrlCollection.Catalogues.ALL(),
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build()
      ).toPromise().then(res => <TreeNode[]>res.data);
  }

  createCatalogue(name: string, description: string): Observable<Catalogue> {
    return this.httpClient.post<Catalogue>(
      UrlCollection.Catalogues.CREATE(),
        JSON.stringify({name: name, description: description}),
        new HttpOptionsFactory()
          .addAcceptJson()
          .addContentTypeJson()
          .build());
  }

  getCatalogue(name: string): Observable<Catalogue> {
    return this.httpClient.post<Catalogue>(
      UrlCollection.Catalogues.GET(),
        JSON.stringify({name: name}),
          new HttpOptionsFactory()
          .addAcceptJson()
          .addContentTypeJson()
          .build());
  }

  deleteCatalogue(catalogueId: string) {
    return this.httpClient.get(
      UrlCollection.Catalogues.DELETE() + '/' + catalogueId,
        new HttpOptionsFactory()
          .addAcceptJson()
          .addContentTypeJson()
          .build());
  }

  addEntry(catalogueId: string, name: string, description: string): Observable<any> {
    return this.httpClient.post<any>(
      UrlCollection.Catalogues.ADDENTRY() + '/' + catalogueId,
      JSON.stringify({name: name, description: description}),
      new HttpOptionsFactory()
        .addAcceptJson()
        .addContentTypeJson()
        .build());
  }

  removeEntry(entryId: string) {
    return this.httpClient.get(
      UrlCollection.Catalogues.REMOVEENTRY() + '/' + entryId,
      new HttpOptionsFactory()
      .addAcceptJson()
      .addContentTypeJson()
      .build());
  }
}
