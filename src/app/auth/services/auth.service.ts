import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
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

  login(user, pass): Subject<Boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      observe: 'response' as 'response'
    };

    const result = new Subject<Boolean>();

    // tslint:disable-next-line: max-line-length
    this.http.post('http://localhost:8081/rest/api/user/login', JSON.stringify({user: user, passwd: pass}), httpOptions).subscribe((resp: HttpResponse<Object>) => {
      this.isLoggedIn = true;
      this.roles = resp.body['roles'];
      this.token = resp.body['token'];
      result.next(true);
    }, error => {
      result.next(false);
    });

    return result;
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
