import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserItem } from '../models/user-item';
import { Role, BaseRoles } from 'src/app/shared/models/role';
import { UrlCollection } from 'src/app/shared/url-collection';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public userList: UserItem[];

  constructor(private http: HttpClient, private authService: AuthService) {
    this.refreshUserList();
   }

  refreshUserList() {
    this.http.get<UserItem[]>(UrlCollection.UserManagement.ALL())// , this.authHeader)
    .subscribe(userList => this.userList = userList);
  }

  updateUser(user: UserItem): Observable<any> {
    return this.http.post(UrlCollection.UserManagement.UPDATE(), user); // , this.authHeader);
  }

  createUser(user: UserItem): Observable<any> {
    return this.http.post(UrlCollection.UserManagement.CREATE(), user); // , this.authHeader);
  }

  activateUser(user: UserItem): Observable<any> {
    return this.http.get(UrlCollection.USER_API_BASE_PATH() + '/activation/' + user.loginName + '/1'); // , this.authHeader);
  }

  deactivateUser(user: UserItem): Observable<any> {
    return this.http.get(UrlCollection.USER_API_BASE_PATH() + '/activation/' + user.loginName + '/0'); // , this.authHeader);
  }

  deleteUser(user: UserItem): Observable<any> {
    return this.http.post(UrlCollection.UserManagement.DELETE(), user); // , this.authHeader);
  }
}
