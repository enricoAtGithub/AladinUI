import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { RootStoreState, UserProfileActions } from 'src/app/root-store/root-index';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router: Router,
    private store$: Store<RootStoreState.State>) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.authService.isLoggedIn$
        .pipe(
          mergeMap(isLoggedIn => this.authService.tokenIsValidated$
            .pipe(
              mergeMap(tokenValidated => {
                if (tokenValidated && isLoggedIn) {
                  return of(true);
                }
                if (!isLoggedIn) {
                  console.log('user is not logged in. redirect to login');
                  this.router.navigate(['/login']);
                  return of(false);
                }
                return this.authService.validateToken()
                  .pipe(
                    tap(response => {
                      if (response.tokenIsValid) {
                        console.log('token-validation succeeded.');
                        this.store$.dispatch(UserProfileActions.validateTokenSucceeded({user: response.loginContext}));
                      } else {
                        console.log('token is invalid. redirect to login');
                        this.store$.dispatch(UserProfileActions.validateTokenFailed());
                        this.router.navigate(['/login']);
                      }
                    }),
                    map(result => result.tokenIsValid)
                  ); })
            ))
        );
  }

}
