import { Injectable } from '@angular/core';
import PCC from '../config/permission-config-combined';
import JMeleonActionsUtils from '../utils/jmeleon-actions.utils';
import { _runtimeChecksFactory } from '@ngrx/store/src/runtime_checks';

/**
 * This service checks if the current user is authorized to perform a ceration action.
 * This service should operate local only. (For request to the backend use a different one)
 *
 *  an observable might not be needed (at first), since this should only be relevant after the login.
 *  (but we had such reasoning before...)
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
  private _permittedActionsForCurrentUser: string[] = [];

  get actionsList(): string[] {
    return this._actionDict.map(entry => entry[1]);
  }

  get permittedActionsList(): string[] {
    return this._permittedActionsForCurrentUser;
  }


  constructor() {
  }

  // when initializing manual, keep in mind that this
  // method ignores the first level of the action-config-tree.
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

  reset(): void {
    this._initialized = false;
    this._actionDict = [];
  }

  initActionsPermittedForCurrentUser(actions: string[]): void {

    // remove star-suffix from node-paths so that they can be matched with full action paths.
      actions = actions.map(action =>
        JMeleonActionsUtils.removeSuffix(action));

    this._permittedActionsForCurrentUser = actions;
  }

  // can't work with type Function here because the leafs are pure objects.
  // getActionStringFromFunction = (f: Function | Object): string => this._actionDict.find(tuple => tuple[0] === f)[1];
  getActionStringFromFunction = (f: Function | Object): string => {
    const element = this._actionDict.find(tuple => tuple[0] === f);
    if (!element) {
      // throw?
      return undefined;
    }
    return element[1];
  }



  // it won't be that easy, since we have to factor in super-permissions in part strings
  userHasPermissionForAction = (f: Function | Object): boolean =>
    this._permittedActionsForCurrentUser.includes(this.getActionStringFromFunction(f)) ||
    // if that works, make it more performant.
    this._permittedActionsForCurrentUser.some(permittedAction => this.getActionStringFromFunction(f).includes(permittedAction))

}
