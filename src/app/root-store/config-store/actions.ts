import { Action } from '@ngrx/store';
import { EntityConfiguration } from '../../shared/models/entity-configuration';

export enum ActionTypes {
    CONFIG_LOAD = '[Config] loaded configs',
    CONFIG_LOAD_REQUEST = '[Config] load requested'
}

export class ConfigsLoadAction implements Action {
    readonly type = ActionTypes.CONFIG_LOAD;
    constructor(public payload: { configs: EntityConfiguration[] }) {}
}

export class ConfigsLoadRequestAction implements Action {
    readonly type = ActionTypes.CONFIG_LOAD_REQUEST;
}


export type Actions =
ConfigsLoadRequestAction |
ConfigsLoadAction;
