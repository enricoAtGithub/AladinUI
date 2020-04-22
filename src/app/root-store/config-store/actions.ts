import { Action } from '@ngrx/store';
import { EntityConfiguration } from '../../shared/models/entity-configuration';
import { GroupConfiguration } from 'src/app/shared/models/group-configuration';

export enum ActionTypes {
    CONFIG_LOAD = '[Config] loaded configs',
    CONFIG_LOAD_REQUEST = '[Config] load requested',
    GROUP_CONFIG_LOAD = '[Config] loaded group-configs',
    GROUP_CONFIG_LOAD_REQUEST = '[Config] group load requested'
}

export class ConfigsLoadAction implements Action {
    readonly type = ActionTypes.CONFIG_LOAD;
    constructor(public payload: { configs: EntityConfiguration[] }) {}
}

export class ConfigsLoadRequestAction implements Action {
    readonly type = ActionTypes.CONFIG_LOAD_REQUEST;
}

export class GroupConfigsLoadAction implements Action {
    readonly type = ActionTypes.GROUP_CONFIG_LOAD;
    constructor(public payload: { configs: GroupConfiguration[] }) {}
}

export class GroupConfigsLoadRequestAction implements Action {
    readonly type = ActionTypes.GROUP_CONFIG_LOAD_REQUEST;
}


export type Actions =
ConfigsLoadRequestAction |
ConfigsLoadAction |
GroupConfigsLoadRequestAction |
GroupConfigsLoadAction;
