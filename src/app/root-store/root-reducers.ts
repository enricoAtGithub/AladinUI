import * as fromRootState from './root-state';
import { Actions, ActionTypes } from './root-actions';

export function rootReducer(state = fromRootState.initialRootState, action: Actions): fromRootState.State {
    switch (action.type) {
        case ActionTypes.LOGOUT_SUCCEEDED: {
            console.log('resetting to init state.');
            return fromRootState.initialRootState;
        }
        default: {
            return state;
        }
    }
}
