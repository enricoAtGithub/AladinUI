import { Action } from '@ngrx/store';
import { User } from 'src/app/shared/models/user';

export enum ActionTypes {
  LOGIN_REQUEST = '[Login] Login Request',
  LOGIN_FAILURE = '[Login] Login Failure',
  LOGIN_SUCCESS = '[Login] Login Success',
  LOGOUT_REQUESTED = '[Logout] Logout Requested',
  LOGOUT_SUCCESS = '[Logout] Logout Success'
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

export class LogoutRequestedAction implements Action {
  readonly type = ActionTypes.LOGOUT_REQUESTED;
  constructor(public payload = { sendLogoutRequestToServer: true }) {}
}

export class LogoutSuccessAction implements Action {
  readonly type = ActionTypes.LOGOUT_SUCCESS;
}

export type Actions =
  LoginRequestAction |
  LoginFailureAction |
  LoginSuccessAction |
  LogoutRequestedAction |
  LogoutSuccessAction;
