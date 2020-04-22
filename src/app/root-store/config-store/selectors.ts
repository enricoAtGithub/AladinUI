import { EntityConfiguration } from '../../shared/models/entity-configuration';
import { GroupConfiguration } from 'src/app/shared/models/group-configuration';
import { ConfigState } from './state';
import { createSelector, MemoizedSelector, createFeatureSelector } from '@ngrx/store';

const getConfigs = (state: ConfigState): EntityConfiguration[] => state.configs;
const getGroupConfigs = (state: ConfigState): GroupConfiguration[] => state.groupConfigs;

export const selectConfigsState: MemoizedSelector<object, ConfigState> = createFeatureSelector<ConfigState>('config');
export const selectConfigs: MemoizedSelector<object, EntityConfiguration[]> = createSelector(selectConfigsState, getConfigs);
export const selectGroupConfigs: MemoizedSelector<object, GroupConfiguration[]> = createSelector(selectConfigsState, getGroupConfigs);
