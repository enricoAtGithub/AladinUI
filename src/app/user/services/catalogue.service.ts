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

  createCatalogue(name: String): Observable<Catalogue> {
    return this.httpClient.post<Catalogue>(UrlCollection.Catalogues.CREATE(), JSON.stringify({name: name}));
  }

  getCatalogue(name: String): Observable<Catalogue> {
    return this.httpClient.post<Catalogue>(UrlCollection.Catalogues.GET(), JSON.stringify({name: name}));
  }

  deleteCatalogue(name: String): Observable<null> {
    return this.httpClient.post<null>(UrlCollection.Catalogues.DELETE(), JSON.stringify({name: name}));
  }

  addEntry(name: String, values: any[]): Observable<null> {
    return this.httpClient.post<null>(UrlCollection.Catalogues.ADD(), JSON.stringify({name: name, values: values}));
  }

  removeEntry(name: String, values: any[]): Observable<Catalogue[]> {
    return this.httpClient.post<null>(UrlCollection.Catalogues.REMOVE(), JSON.stringify({name: name, values: values}));
  }
}
