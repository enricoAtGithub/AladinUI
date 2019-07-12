import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { UserItem } from '../models/user-item';
import { Role, BaseRoles } from 'src/app/shared/models/role';
import { UrlCollection } from 'src/app/shared/url-collection';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private userListSubject: Subject<UserItem[]>;
  public userList$: Observable<UserItem[]>;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userListSubject = new BehaviorSubject<UserItem[]>(null);
    this.userList$ = this.userListSubject.asObservable();
   }

  refreshUserList() {
    this.http.get<UserItem[]>(UrlCollection.UserManagement.ALL())// , this.authHeader)
    .subscribe(userList => this.userListSubject.next(userList));
  }

  updateUserListLocally(newUserList: UserItem[]) {
    this.userListSubject.next(newUserList);
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
