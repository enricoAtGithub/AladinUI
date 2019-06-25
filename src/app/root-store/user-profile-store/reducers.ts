import { initialState, UserProfileState } from './state';
import { ActionTypes, Actions } from './actions';

export function userProfileReducer(state = initialState, action: Actions): UserProfileState {
   switch (action.type) {
      case ActionTypes.LOGIN_REQUEST:
        return {
          ...state,
          error: null,
          isInLogin: true
        };
      case ActionTypes.LOGIN_SUCCESS:
        return {
          ...state,
          user: action.payload.user,
          error: null,
          isInLogin: false,

        };
      case ActionTypes.LOGIN_FAILURE:
        return {
          ...state,
          error: action.payload.error,
          isInLogin: false
        };
      case ActionTypes.LOGOUT_REQUESTED:
        return {
          ...state,
          isInLogout: true
        };
      case ActionTypes.LOGOUT_SUCCESS:
        return {
          ...state,
          isInLogout: false,
          user: null
        };
      default: {
         return state;
      }
    }
 }
