import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JMeleonPermissionsService } from '../services/jmeleon-permissions.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementGuard implements CanActivate {
  constructor(private jmeleonPermissionService: JMeleonPermissionsService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userIsAdmin = this.jmeleonPermissionService.currentUserHasAdminRole();

    if (!userIsAdmin) {
      console.log('Permission check for user management area failed. Redirecting to dashboard');
      this.router.navigate(['/dashboard']);
    }

    return userIsAdmin;
  }

}
