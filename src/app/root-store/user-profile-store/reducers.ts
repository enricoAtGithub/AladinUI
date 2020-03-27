import { initialState, UserProfileState } from './state';
import { ActionTypes, Actions } from './actions';

export function userProfileReducer(state = initialState, action: Actions): UserProfileState {
   switch (action.type) {
      case ActionTypes.LOGIN_REQUEST:
        return {
          ...state,
          error: '',
          isInLogin: true
        };
      case ActionTypes.LOGIN_SUCCESS:
        return {
          ...state,
          user: action.payload.user,
          error: '',
          isInLogin: false,

        };
      case ActionTypes.LOGIN_PASSWORD_CHANGE:
        return {
          ...state,
          user: action.payload.user,
          error: '',
        };
      case ActionTypes.LOGIN_FAILURE:
        console.log('login failure state: ', action.payload.error);
        return {
          ...state,
          error: action.payload.error,
          isInLogin: false
        };
      case ActionTypes.LOGOUT_REQUESTED:
        return {
          ...state,
          error: '',
          isInLogout: true
        };
      case ActionTypes.LOGOUT_SUCCESS:
        return {
          ...state,
          isInLogout: false,
          error: '',
          user: null
        };
      default: {
         return state;
      }
    }
 }
