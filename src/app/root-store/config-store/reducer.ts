import { ActionTypes, Actions } from './actions';
import { ConfigState, initialState } from './state';

export function configReducer(state = initialState, action: Actions): ConfigState {
    switch (action.type) {
        case ActionTypes.CONFIG_LOAD:
            return {
                ...state,
                configs: action.payload.configs
            };
        default: {
            return state;
        }
    }
}