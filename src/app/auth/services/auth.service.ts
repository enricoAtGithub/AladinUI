import { Injectable } from '@angular/core';
import { Subject, Observable, ReplaySubject, BehaviorSubject, of, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { User } from 'src/app/shared/models/user';
import { UrlCollection } from 'src/app/shared/url-collection';
import { switchMap, map, tap, catchError, share } from 'rxjs/operators';
import { HttpHeadersService } from 'src/app/shared/services/http-headers.service';
import { HttpResult } from 'src/app/shared/models/http/http-result';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ---ATTENTION---
  // use only if use of the observables is not possible!!!
  public localUser: User;
  public isLoggedIn = false;
  // ---------------


  public redirectUrl: string;

  private userSubject: Subject<User>;
  public localUser$: Observable<User>;
  private isLoggedInSubject: Subject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor(private http: HttpClient, private httpHeaderService: HttpHeadersService) {
    this.userSubject = new ReplaySubject<User>(1);
    this.userSubject.next(null);
    this.localUser$ = this.userSubject.asObservable(); // .pipe(share());
    this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable(); // .pipe(share());

    this.localUser$.subscribe(
      user => {
        console.log('local user: ', user);
        this.localUser = user;
    });
    this.isLoggedIn$.subscribe(
      isLoggedIn => {
        console.log('is logged in: ', isLoggedIn);
        this.isLoggedIn = isLoggedIn;
      }
    );
  }

  login(userName: string, pass: string): Observable<HttpResult<User>> {

    const result = this.http
      .post<User>(
        UrlCollection.UserManagement.LOGIN(),
        JSON.stringify({user: userName, passwd: pass, userAgent: navigator.userAgent}),
        this.httpHeaderService.getObserveHttpOption())
      .pipe(
        map(httpResponse => {
          return httpResponse.body as User;
        }),
        tap(user => {
          this.userSubject.next(user);
          this.isLoggedInSubject.next(true);
          // todo: create local storage service!
          localStorage.setItem('user', JSON.stringify(user));
        }),
        map(user => {
          const httpResult: HttpResult<User> = {
            success: true,
            result: user
          };
          return httpResult;
        }),
        catchError(err => {
          const httpResult: HttpResult<User> = {
            success: false,
            // errMsg: err['message'].toString() //no vpn connection
            errMsg: err['error']['message'].toString()
          };
          return of(httpResult);
        })
      );

    return result;
  }

  logout(): Observable<[boolean, string]> {
    const logoutResult = this.http.get(UrlCollection.UserManagement.LOGOUT())
    .pipe(
      map(() => {
        this.userSubject.next(null);
        this.isLoggedInSubject.next(false);
        const result: [boolean, string] = [true, ''];
        return result;
      }),
      catchError(err => {
        console.log('logout error: ', err);
        const result: [boolean, string] = [false, err['error']['message'] ? err['error']['message'].toString() : err];
        return of(result);
      })
    );
    return logoutResult;
  }

  // test!!!
  changePassword(oldpass: string, newpass: string): Observable<boolean> {
    return this.localUser$
      .pipe(
        switchMap(user => {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'authorization': user.token
            }),
            observe: 'response' as 'response'
          };

          return this.http
            .post(UrlCollection.UserManagement.CHANGE_PASSWD(),
              JSON.stringify({oldpasswd: oldpass, newpasswd: newpass}), httpOptions)
            .pipe(
              map(() => true),
              catchError(() => of(false))
            );
        })
      );

  }

}
