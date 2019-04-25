import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserItem } from '../models/user-item';
import { Roles } from 'src/app/shared/models/roles';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(http: HttpClient) { }

  getUserList():Observable<UserItem[]> {

    let userItem01 = new UserItem();
    userItem01.email = 'max.mustermann@mail.com';
    userItem01.userName = 'max mustermann';
    userItem01.createdAt = '01.01.2019 - 09:41';
    userItem01.isActive = true;
    userItem01.lastActive = '20.04.2019 - 11:18';
    userItem01.lastUsedBrowser = 'generic browser';
    userItem01.mandant = 0;
    userItem01.roles = [Roles.USER];

    const users : UserItem[] = [
      userItem01
    ];
    

    return of(users);
  }

}
