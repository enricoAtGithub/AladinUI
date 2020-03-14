import { Injectable } from '@angular/core';
import PCC from '../config/permission-config-combined';
import JMeleonActionsUtils from '../utils/jmeleon-actions.utils';
import { _runtimeChecksFactory } from '@ngrx/store/src/runtime_checks';

/**
 * This service checks if the current user is authorized to perform a ceration action.
 * This service should operate local only. (For request to the backend use a different one)
 *
 *
 */
@Injectable({
  providedIn: 'root'
})
export class JmeleonActionsPermissionService {

  private _root_action_config = PCC;
  // would have liked a real dict like a Record, but
  // have not yet found one that supports real objects as key
  private _actionDict: [Function, string][] = [];
  private _initialized: boolean;
  private _permittedActionsForCurrentUser: string[];

  get actionsList(): string[] {
    return this._actionDict.map(entry => entry[1]);
  }

  get permittedActionsList(): string[] {
    return this._permittedActionsForCurrentUser;
  }


  constructor() {
  }

  // when initializing manual, keep in mind that this
  // method ignores the first level of the config-tree.
  initializeDict(tree: Function = null): void {
    if (this._initialized) {
      return;
    }

    if (!tree) {
      tree = this._root_action_config;
    }
    Object.getOwnPropertyNames(tree)
      .filter(key => tree.propertyIsEnumerable(key))
      .forEach(key =>
        this._actionDict = this._actionDict.concat(
          JMeleonActionsUtils.generateActionObjectMapFromTree(tree[key])));



    this._initialized = true;
  }

  initActionsPermittedForCurrentUser(actions: string[]): void {
    this._permittedActionsForCurrentUser = actions;
  }

  initActionsPermittedForCurrentUserViaStore(): void {

  }

  // can't work with type Function here because the leafs are pure objects.
  getActionStringFromFunction = (f: any): string => this._actionDict.find(tuple => tuple[0] === f)[1];


  userHasPermissionForAction = (f: any): boolean =>
    this._permittedActionsForCurrentUser.includes(this.getActionStringFromFunction(f))

}
