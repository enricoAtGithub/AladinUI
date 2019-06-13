import { Action } from '@ngrx/store';
import { User } from 'src/app/shared/models/user';

export enum ActionTypes {
  LOGIN_REQUEST = '[Login] Login Request',
  LOGIN_FAILURE = '[Login] Login Failure',
  LOGIN_SUCCESS = '[Login] Login Success'
}

export class LoginRequestAction implements Action {
  readonly type = ActionTypes.LOGIN_REQUEST;
  constructor(public payload: { userName: string; password: string }) {}
}

export class LoginFailureAction implements Action {
  readonly type = ActionTypes.LOGIN_FAILURE;
  constructor(public payload: { error: string }) {}
}

export class LoginSuccessAction implements Action {
  readonly type = ActionTypes.LOGIN_SUCCESS;
  constructor(public payload: { user: User }) {}
}

export type Actions = LoginRequestAction | LoginFailureAction | LoginSuccessAction;
