import { Injectable } from '@angular/core';
import JMeleonActionsUtils from '../utils/jmeleon-actions.utils';
import { _runtimeChecksFactory } from '@ngrx/store/src/runtime_checks';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, from, defer, of, merge, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { RootStoreState } from 'src/app/root-store/root-index';
import { Store, select } from '@ngrx/store';
import * as fromUserSelectors from 'src/app/root-store/user-profile-store/user-profile.selectors';

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
    // private authService: AuthService,
    private store$: Store<RootStoreState.State>
    ) {
  }

  initActionsPermittedForCurrentUser = (actions: string[]): void => {
    this._isInitialized = true;
    // console.log('initializing permissions for actions: ', actions);
    this.ngxPermissionService.addPermission(actions);

  }

  initWithCurrentUserActionsIfNotYetInitialized = (): void => {
    if (this._isInitialized) {
      return;
    }
    this._isInitialized = true;
    this.store$.pipe(
      select(fromUserSelectors.selectUserProfileUser),
      ).subscribe(user => {
    // this.authService.localUser$.subscribe(user => {
      if (!user) {
        return;
      }
      // console.log('initializing permissions for actions: ', user.allowedActions);
      this.ngxPermissionService.addPermission(user.allowedActions);
    });

  }

  userHasPermissionForAction = (action: string, dict: object = null): Observable<boolean> => {
    // console.log(`checking permission for: '${action}'`);
    // resolve variables
    if (!!dict) {
      action = JMeleonActionsUtils.resolveVars(action, dict);
    }
    // console.log(`checking permission for: '${action}'`);
    // converting promise into observable
    return defer(() => {
      const result = this.ngxPermissionService.hasPermission(action);
      return result;
    }).pipe(
      tap(result => {
        // console.log(`user has ${(result ? '' : 'no ')} permission for: '${action}'`);
        // if (!result){
        //   this.ngxPermissionService.permissions$.subscribe(perm => {
        //     console.log('current permissions: ', perm);
        //   });
        // }
        
      })
    );
  }

  // returns a record dict, where the key is the action-string and the value states, 
  // if the current user has permission for that action.
  userHasPermissionForActions = (actions: string[], dict: object = null): Observable<Record<string, boolean>> => {

    const actionObsList = actions.map(action => of(action));
    const actionAndPermissionObsList =
      actionObsList.map(aObs => aObs.pipe(
      switchMap(action => this.userHasPermissionForAction(action, dict).pipe(
        map(permission => {
          const t: [string, boolean] = [action, permission];
          return t;
        })))
    ));

    const merged = forkJoin(actionAndPermissionObsList);

    const result = merged.pipe(
      map(list => {
        const innerResult: Record<string, boolean> = {};
        list.forEach(item => innerResult[item[0]] = item[1]);
        return innerResult;
      })
    );

    return result;
  }

  // check, if user has permission for every single action in the action array.
  userHasPermissionForAllActions = (actions: string[], dict: object = null): Observable<boolean> =>
    forkJoin(actions.map(action => this.userHasPermissionForAction(action, dict)))
      .pipe(
        map(results => results.every(Boolean))
      )



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
