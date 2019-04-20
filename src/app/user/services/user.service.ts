import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserItem } from '../models/user-item';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(http: HttpClient) { }

  getUserList():Observable<UserItem> {
    return undefined;
  }

}
