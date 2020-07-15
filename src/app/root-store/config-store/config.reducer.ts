import { initialState } from './config.state';
import { createReducer, on } from '@ngrx/store';
import * as ConfigActions from './config.actions';

export const configReducer = createReducer(
    initialState,
    on(ConfigActions.loadConfigsSucceeded,
        (state, action) => {
            return {
                ...state,
                configs: action.configs
            };
        }
    ),
    on(ConfigActions.loadGroupConfigsSucceeded,
        (state, action) => {
            return {
                ...state,
                groupConfigs: action.configs
            };
        }
    )
);
