import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Catalogue } from 'src/app/shared/models/catalogue';
import { UrlCollection } from 'src/app/shared/url-collection';
import { TreeNode } from 'primeng/primeng';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  constructor(private httpClient: HttpClient) { }

  getAllCatalogues(): Promise<TreeNode[]> {
    return this.httpClient.get<any>(UrlCollection.Catalogues.ALL()).toPromise().then(res => <TreeNode[]>res.data);
  }

  createCatalogue(name: string, description: string): Observable<Catalogue> {
    return this.httpClient.post<Catalogue>(UrlCollection.Catalogues.CREATE(), JSON.stringify({name: name, description: description}));
  }

  getCatalogue(name: string): Observable<Catalogue> {
    return this.httpClient.post<Catalogue>(UrlCollection.Catalogues.GET(), JSON.stringify({name: name}));
  }

  deleteCatalogue(catalogueId: string) {
    return this.httpClient.get(UrlCollection.Catalogues.DELETE() + '/' + catalogueId);
  }

  addEntry(catalogueId: string, name: string, description: string): Observable<any> {
    return this.httpClient.post<any>(UrlCollection.Catalogues.ADDENTRY() + '/' + catalogueId,
     JSON.stringify({name: name, description: description}));
  }

  removeEntry(entryId: string) {
    return this.httpClient.get(UrlCollection.Catalogues.REMOVEENTRY() + '/' + entryId);
  }
}
