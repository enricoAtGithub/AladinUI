import { Action } from '@ngrx/store';

export enum ActionTypes {
    LOGOUT_SUCCEEDED = '[User-API] Logout Succeeded'
}


export class LogoutSucceededAction implements Action {
    readonly type = ActionTypes.LOGOUT_SUCCEEDED;
}

export type Actions =
LogoutSucceededAction;
