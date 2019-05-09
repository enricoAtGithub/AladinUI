import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserItem } from '../models/user-item';
import { Role, BaseRoles } from 'src/app/shared/models/role';
import { UrlCollection } from 'src/app/shared/url-collection';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUserList(): Observable<UserItem[]> {
    return this.http.get<UserItem[]>(UrlCollection.UserManagement.ALL);
  }

  updateUser(user: UserItem): Observable<any> {
    return this.http.post(UrlCollection.UserManagement.UPDATE, user);
  }

  getUserListDebug():Observable<UserItem[]> {

    const userItem01 = new UserItem();
    userItem01.email = 'max.mustermann@mail.com';
    userItem01.userName = 'max mustermann';
    userItem01.createdAt = '01.01.2019 - 09:41';
    userItem01.isActive = true;
    userItem01.lastActive = '20.04.2019 - 11:18';
    userItem01.lastUsedBrowser = 'generic browser';
    userItem01.mandant = 0;
    userItem01.roles = [{name: BaseRoles.USER + '', displayName: BaseRoles.USER + ''}];

    const userItem02 = new UserItem();
    userItem02.email = 'marie.mustermann@mail.com';
    userItem02.userName = 'marie mustermann';
    userItem02.createdAt = '11.11.2019 - 19:41';
    userItem02.isActive = true;
    userItem02.lastActive = '10.10.2019 - 11:18';
    userItem02.lastUsedBrowser = 'generic browser';
    userItem02.mandant = 0;
    userItem02.roles = [
      {name: BaseRoles.USER + '', displayName: BaseRoles.USER + ''},
      {name: BaseRoles.ADMIN + '', displayName: BaseRoles.ADMIN + ''}
    ];

    const userItem03 = new UserItem();
    userItem03.email = 'mark.mustermann@mail.com';
    userItem03.userName = 'mark mustermann';
    userItem03.createdAt = '02.05.2019 - 13:45';
    userItem03.isActive = false;
    userItem03.lastActive = '18.08.2019 - 18:18';
    userItem03.lastUsedBrowser = 'generic browser';
    userItem03.mandant = 0;
    userItem03.roles = [
      {name: BaseRoles.USER + '', displayName: BaseRoles.USER + ''}
    ];


    const users: UserItem[] = [
      userItem01,
      userItem02,
      userItem03
    ];

    return of(users);
  }

}
