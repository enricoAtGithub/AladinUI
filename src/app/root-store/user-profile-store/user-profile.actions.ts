import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/shared/models/user';

export const loginRequested = createAction('[Login] Login Request', props<{ userName: string; password: string }>());
export const loginFailed = createAction('[Login] Login Failure', props<{error: string}>());
export const loginSucceeded = createAction('[Login] Login Success', props<{ user: User }>());
export const passwordChangeRequired = createAction('[Login] Login Password change required', props<{ user: User }>());
export const logoutRequested = createAction('[Logout] Logout Requested', props<{ sendLogoutRequestToServer: boolean }>());
export const logoutSucceeded = createAction('[Logout] Logout Success');