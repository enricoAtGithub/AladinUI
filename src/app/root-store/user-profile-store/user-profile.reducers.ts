import { initialState } from './user-profile.state';
import { createReducer, on } from '@ngrx/store';
import * as UserProfileActions from './user-profile.actions';

 export const userProfileReducer = createReducer(
   initialState,
   on(UserProfileActions.loginRequested, (state, action) => {
     return {
       ...state,
       error: '',
       isInLogin: true
     };
   }),
   on(UserProfileActions.loginSucceeded, (state, action) => {
     return {
       ...state,
       user: action.user,
       error: '',
       isInLogin: false
     };
   }),
   on(UserProfileActions.loginFailed, (state, action) => {
     return {
        ...state,
        error: action.error,
        isInLogin: false
      };
   }),


   on(UserProfileActions.passwordChangeRequired, (state, action) => {
     return {
      ...state,
      user: action.user,
      error: ''
    };
   }),


   on(UserProfileActions.logoutRequested, (state, action) => {
     return {
        ...state,
        error: '',
        isInLogout: true
      };
   }),
   on(UserProfileActions.logoutSucceeded, (state, action) => {
     return {
        ...state,
        isInLogout: false,
        error: '',
        user: null
     };
   })
 );
