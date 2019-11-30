import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const url: string = state.url;

      return this.authService.isLoggedIn$
        .pipe(
          tap(isLoggedIn => {
            if (!isLoggedIn) {
              // Store the attempted URL for redirecting
              this.authService.redirectUrl = url;

              // Navigate to the login page with extras
              this.router.navigate(['/login']);
            }
          })
        );
  }

}
