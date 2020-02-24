import { ActionTypes } from './user-profile-store/actions';
import { ActionReducer } from '@ngrx/store';
import { State } from './root-state';

export function clearState(reducer ): ActionReducer<State> {
    return function (state, action) {

      if (action.type === ActionTypes.LOGOUT_SUCCESS) {
        state = undefined;
      }

      return reducer(state, action);
    };
  }
