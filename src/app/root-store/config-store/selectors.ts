import { EntityConfiguration } from '../../shared/models/entity-configuration';
import { ConfigState } from './state';
import { createSelector, MemoizedSelector, createFeatureSelector } from '@ngrx/store';

const getConfigs = (state: ConfigState): EntityConfiguration[] => state.configs;

export const selectConfigsState: MemoizedSelector<object, ConfigState> = createFeatureSelector<ConfigState>('config');
export const selectConfigs: MemoizedSelector<object, EntityConfiguration[]> = createSelector(selectConfigsState, getConfigs);
