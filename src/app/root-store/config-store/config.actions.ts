import { Action, createAction, props } from '@ngrx/store';
import { EntityConfiguration } from '../../shared/models/entity-configuration';
import { GroupConfiguration } from 'src/app/shared/models/group-configuration';

export const loadConfigsRequested = createAction('[Config] load requested');
export const loadConfigsSucceeded = createAction('[Config] loaded configs', props<{ configs: EntityConfiguration[] }>());
export const loadGroupConfigsRequested = createAction('[Config] group load requested');
export const loadGroupConfigsSucceeded = createAction('[Config] loaded group-configs', props<{ configs: GroupConfiguration[] }>());
