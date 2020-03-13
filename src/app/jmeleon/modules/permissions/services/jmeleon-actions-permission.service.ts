import { Injectable } from '@angular/core';
import PCC from '../config/permission-config-combined';
import JMeleonActionsUtils from '../utils/jmeleon-actions.utils';

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


  constructor() {
  }

  // could use an optional argument to set another config file (for testing)
  // but this is tricky since the default config has an additional layer.
  initializeDict(tree: Function = null): void {
    if (this._initialized) {
      return;
    }

    if (!tree) {
      // this.generateActionsList();
    } else {

    }

    this._initialized = true;
  }

  generateActionsList = (): string[] => {
    // this would add the root layer to the hierarchy
    // return JMeleonActionsUtils.generateActionListFromTree(this._root_action_config);

    let result = JMeleonActionsUtils.generateActionListFromTree(this._root_action_config.jmeleon);
    result = result.concat(JMeleonActionsUtils.generateActionListFromTree(this._root_action_config.custom));

    return result;
  }


}
