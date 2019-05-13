import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { User } from 'src/app/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public localUser: User;
  public isLoggedIn = false;
  public redirectUrl: string;

  constructor(private http: HttpClient) { }

  login(user, pass): Subject<Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      observe: 'response' as 'response'
    };

    const result = new Subject<Object>();

    this.http.post('http://localhost:8081/rest/api/user/login',
    JSON.stringify({user: user, passwd: pass, userAgent: navigator.userAgent}), httpOptions).subscribe((resp: HttpResponse<Object>) => {
      this.isLoggedIn = true;
      this.localUser = <User>resp.body;
      result.next(true);
    }, error => {
      result.next(error['error']['message']);
    });

    return result;
  }

  logout(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization':  this.localUser.token
      })
    };
    this.http.get('http://localhost:8081/rest/api/user/logout', httpOptions).subscribe();
    this.isLoggedIn = false;
  }

  changePassword(oldpass, newpass): Subject<Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.localUser.token
      }),
      observe: 'response' as 'response'
    };

    const result = new Subject<Object>();

    this.http.post('http://localhost:8081/rest/api/user/changepwd',
    JSON.stringify({oldpasswd: oldpass, newpasswd: newpass}), httpOptions).subscribe((resp: HttpResponse<Object>) => {
      result.next(true);
    }, error => {
      result.next(error['error']['message']);
    });

    return result;
  }
}
