import { initialState, ConfigState } from './config.state';
import { createReducer, on, ActionReducer } from '@ngrx/store';
import * as ConfigActions from './config.actions';
import { InjectionToken } from '@angular/core';

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


export const CONFIG_PROFILE_REDUCER = new InjectionToken<ActionReducer<ConfigState>>('Config Reducer');
