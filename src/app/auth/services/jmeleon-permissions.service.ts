import { Injectable } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { User } from 'src/app/shared/models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JMeleonPermissionsService {

/*
  It is really easy to confuse:
  - role/permission and role-/permission-name
  - the user object, created at the login, and the actual user
*/


  readonly ROLE_ADMIN = 'Admin';

  readonly PERMISSION_MANAGE_USERS = 'manageUsers';

  private localUser: User;

  constructor(
    private permissionsService: NgxPermissionsService,
    private authService: AuthService) {
      authService.localUser$.subscribe(user => {
        this.localUser = user;
        if (!!user) {
          this.grandAdminPermissionsIfUserHasAdminRole(user);
        } else {
          console.log('flushing permissions.');
          this.permissionsService.flushPermissions();
      }});
     }

  grandAdminPermissionsIfUserHasAdminRole(user: User): void {
    if (!this.userHasAdminRole(user)) {
      return;
    }
    this.permissionsService.loadPermissions(this.getPermissionsForAdmin());
  }

  currentUserHasPermission(permissionName: string): boolean {
    const permissions = this.permissionsService.getPermissions();
    const userHasPermission = Object.keys(permissions).some(key => key === permissionName);
    console.log(`user has permission for '${permissionName}': ${userHasPermission} `);
    return userHasPermission;
  }

  currentUserHasRole(roleName: string): boolean {
    return this.localUser.roles.some(role => role === roleName);
  }

  currentUserHasAdminRole(): boolean {
    return this.currentUserHasRole(this.ROLE_ADMIN);
  }





  userHasAdminRole(user: User): boolean {
    if (!user) {
      return false;
    }
    if (!user.roles) {
      return false;
    }
    if (!user.roles.some(role => role === this.ROLE_ADMIN)) {
      return false;
    }
    return true;
  }

  getPermissionsForAdmin(): string[] {
    const permission = [];

    permission.push(this.PERMISSION_MANAGE_USERS);

    return permission;
  }


}
