import { Injectable } from '@angular/core';
import { Subject, Observable, ReplaySubject, BehaviorSubject, of, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/shared/models/user';
import { UrlCollection } from 'src/app/shared/url-collection';
import { switchMap, map, tap, catchError, share } from 'rxjs/operators';
import { HttpHeadersService } from 'src/app/shared/services/http-headers.service';
import { HttpResult } from 'src/app/shared/models/http/http-result';
import { HttpOptionsFactory } from 'src/app/shared/models/http/http-options-factory';
import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromUserSelectors from 'src/app/root-store/user-profile-store/selectors';
import { JmeleonActionsPermissionService } from 'src/app/jmeleon/modules/permissions/services/jmeleon-actions-permission.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ---ATTENTION---
  // use only if use of the observables is not possible!!! (for instance in the token interceptor)
  public localUser: User;
  public isLoggedIn = false;
  // ---------------


  public redirectUrl: string;

  private userSubject: Subject<User>;
  public localUser$: Observable<User>;
  private isLoggedInSubject: Subject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private httpHeaderService: HttpHeadersService,
    private store$: Store<RootStoreState.State>, 
    private jmlActionPermissionsService: JmeleonActionsPermissionService) {
    this.userSubject = new ReplaySubject<User>(1);
    this.userSubject.next(null);
    // this.localUser$ = this.userSubject.asObservable(); // .pipe(share());
    this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    // this.isLoggedIn$ = this.isLoggedInSubject.asObservable(); // .pipe(share());

    this.localUser$ = this.store$.pipe(
      select(fromUserSelectors.selectUserProfileUser),
      // tap(user => console.log('this.localUser$:', user))
      );
    this.isLoggedIn$ = this.store$.pipe(
      select(fromUserSelectors.selectUserProfileUser),
      map(user => !!user));


    this.localUser$.subscribe(
      user => {
        // console.log('local user: ', user);
        this.localUser = user;

        if (!!user && !!user.allowedActions){
          this.jmlActionPermissionsService.initActionsPermittedForCurrentUser(user.allowedActions);
        }
    });
    this.isLoggedIn$.subscribe(
      isLoggedIn => {
        // console.log('is logged in: ', isLoggedIn);
        this.isLoggedIn = isLoggedIn;
      }
    );

  }

  login(userName: string, pass: string): Observable<HttpResult<User>> {
    const result = this.http
      .post<User>(
        UrlCollection.UserManagement.LOGIN(),
        {user: userName, passwd: pass, userAgent: navigator.userAgent},
        new HttpOptionsFactory()
          .addContentTypeJson()
          .buildWithObserveOption()
        )
      .pipe(
        map(httpResponse => {
          return httpResponse.body as User;
        }),
        tap(user => {
          this.userSubject.next(user);
          this.isLoggedInSubject.next(true);
          // todo: create local storage service!
          // localStorage.setItem('user', JSON.stringify(user));
        }),
        map(user => {
          const httpResult: HttpResult<User> = {
            success: true,
            result: user
          };
          return httpResult;
        }),
        catchError((err: HttpErrorResponse) => {
          console.log('error: ', err);
          let httpResult: HttpResult<User>;
          // wrong credentials
          if (err.status === 403) {
            httpResult = {
              success: false,
              errMsg: err.error.message
            };
          // no vpn connection, ...?
          } else {
            httpResult = {
            success: false,
            errMsg: err.statusText
            };
          }
          return of(httpResult);
        })
      );
    return result;
  }

  logout(sendLogoutRequestToServer = true): Observable<[boolean, string]> {
    // for invalid token
    if (!sendLogoutRequestToServer) {
      this.userSubject.next(null);
      this.isLoggedInSubject.next(false);
      return of([true, '']);
    }

    const logoutResult = this.http.get(UrlCollection.UserManagement.LOGOUT())
    .pipe(
      map(() => {
        this.userSubject.next(null);
        this.isLoggedInSubject.next(false);
        const result: [boolean, string] = [true, ''];
        return result;
      }),
      catchError(err => {
        // console.log('logout error: ', err);
        const result: [boolean, string] = [false, err['error']['message'] ? err['error']['message'].toString() : err];
        return of(result);
      })
    );
    return logoutResult;
  }

  // test!!!
  changePassword(oldpass: string, newpass: string): Observable<boolean> {
    return this.http
      .post(
        UrlCollection.UserManagement.CHANGE_PASSWD(),
        {oldpasswd: oldpass, newpasswd: newpass},
        new HttpOptionsFactory()
          .addContentTypeJson()
          .buildWithObserveOption())
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );

    // return this.localUser$
    //   .pipe(
    //     switchMap(user => {
    //       const httpOptions = new HttpOptions().addContentTypeJson().addObserveOption();
    //       // const httpOptions = this.httpHeaderService.getHttpOptions(
    //       //   this.httpHeaderService.addContentTypeJson(null), true);
    //       // {
    //       //   headers: new HttpHeaders({
    //       //     'Content-Type':  'application/json',
    //       //     'authorization': user.token
    //       //   }),
    //       //   observe: 'response' as 'response'
    //       // };

    //       return this.http
    //         .post(UrlCollection.UserManagement.CHANGE_PASSWD(),
    //           JSON.stringify({oldpasswd: oldpass, newpasswd: newpass}), httpOptions)
    //         .pipe(
    //           map(() => true),
    //           catchError(() => of(false))
    //         );
    //     })
    //   );

  }

}
