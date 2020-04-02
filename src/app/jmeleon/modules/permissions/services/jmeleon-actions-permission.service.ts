import { Injectable } from '@angular/core';
import JMeleonActionsUtils from '../utils/jmeleon-actions.utils';
import { _runtimeChecksFactory } from '@ngrx/store/src/runtime_checks';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, from, defer } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

/**
 * This service checks if the current user is authorized to perform a ceration action.
 */
@Injectable({
  providedIn: 'root'
})
export class JmeleonActionsPermissionService {

  private _isInitialized = false;

  constructor(
    private ngxPermissionService: NgxPermissionsService,
    private authService: AuthService) {
  }

  initActionsPermittedForCurrentUser = (actions: string[]): void => {
    this._isInitialized = true;
    this.ngxPermissionService.loadPermissions(actions)

  }

  initWithCurrentUserActionsIfNotYetInitialized = (): void => {
    if (this._isInitialized){
      return;
    }
    this._isInitialized = true;
    this.authService.localUser$.subscribe(user => {
      if (!user){
        return;
      }
      this.ngxPermissionService.loadPermissions(user.allowedActions);
    });

  }

  userHasPermissionForAction = (action: string, dict: object = null): Observable<boolean> => {
    // resolve variables
    if (!!dict) {
      action = JMeleonActionsUtils.resolveVars(action, dict);
    }
    // converting promise into observable
    return defer(() => this.ngxPermissionService.hasPermission(action));
  }


  resolveVars = (path: string, dict: object): string => JMeleonActionsUtils.resolveVars(path, dict);
  resolveVars2 = (path: string, vars: string[]): string => JMeleonActionsUtils.resolveVars(path, this.genVarDict(vars));

  genVarDict(vars: string[]) {
    // console.log('vars: ', vars);
    let i = 0;
    const result = {};
    while (i < vars.length) {
      const key = vars[i];
      const value = vars[i + 1];
        // result[vars[i]] = vars[i + i];
      // console.log('key: ', key);
      // console.log('value: ', value);
      result[key] = value;
        i += 2;
    }
    // console.log('result: ', result);
    return result;
  }
}
