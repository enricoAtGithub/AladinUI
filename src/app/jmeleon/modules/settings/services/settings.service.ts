import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CategoryModel } from '../models/category.model';
import { AppConfig } from 'src/app/shared/app-config';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

    // "baseUrl":"http://splylnx2:9023/storage/rest/api",

  constructor(
    private http: HttpClient
    ) { }

  getSettings(): Observable<CategoryModel[]> {
    return this.getSettingUrl('all').pipe(
      switchMap(url => this.http.get<CategoryModel[]>(url))
    );
  }
  getSetting(name: string): Observable<CategoryModel[]> {
    return this.getSettingUrl(name).pipe(
      switchMap(url => this.http.get<CategoryModel[]>(url))
    );
  }

  setSetting(name: string, value: string): Observable<boolean> {
    return this.getSettingUrl('set').pipe(
      switchMap(url =>
        this.http.post(url, {name, value})
        .pipe(
          // todo: find better way to handle empty responses!
          map(() => true),
          catchError(err => {
            console.error(`could not save setting '${name}' with value '${value}'. error: `, err);
            return of(false);
          })
        )
      )
    );
  }

  private getSettingUrl = (name: string): Observable<string> => AppConfig.uiInfo$.pipe(map(uiInfo => `${uiInfo.baseUrl}/settings/${name}`));
}
