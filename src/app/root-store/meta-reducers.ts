import { ActionReducer, MetaReducer } from '@ngrx/store';
import { State } from './root.state';
import { UserProfileActions } from './user-profile-store/user-profile-index';

export function clearState(reducer: ActionReducer<State>): ActionReducer<State> {
    return function (state, action) {

      if (action.type === UserProfileActions.logoutSucceeded().type) {

        state = undefined;
      }

      return reducer(state, action);
    };
  }

export const metaReducers: MetaReducer<State>[] = [clearState];
