import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn = false;
  public displayName: string;
  public roles: Object;
  public redirectUrl: string;

  private token: string;

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
      this.roles = resp.body['roles'];
      this.token = resp.body['token'];
      result.next(true);
    }, error => {
      result.next(error['error']['message']);
    });

    return result;
  }

  logout(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization':  this.token
      })
    };
    this.http.get('http://localhost:8081/rest/api/user/logout', httpOptions).subscribe();
    this.isLoggedIn = false;
  }

  changePassword(oldpass, newpass): Subject<Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': this.token
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
