import { Injectable } from '@angular/core';
import JMeleonActionsUtils from '../utils/jmeleon-actions.utils';
import { _runtimeChecksFactory } from '@ngrx/store/src/runtime_checks';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, from, defer } from 'rxjs';

/**
 * This service checks if the current user is authorized to perform a ceration action.
 */
@Injectable({
  providedIn: 'root'
})
export class JmeleonActionsPermissionService {

  constructor(private ngrxPermissionService: NgxPermissionsService) {
  }

  initActionsPermittedForCurrentUser(actions: string[]): void {
     console.log('adding permission for actions: ', actions);
      this.ngrxPermissionService.addPermission(actions);
  }

  userHasPermissionForAction = (action: string, dict: object = null): Observable<boolean> => {
    // resolve variables
    if (!!dict) {
      action = JMeleonActionsUtils.resolveVars(action, dict);
    }
    // converting promise into observable
    return defer(() => this.ngrxPermissionService.hasPermission(action));
  }

  resolveVars = (path: string, dict: object): string => JMeleonActionsUtils.resolveVars(path, dict);
}
