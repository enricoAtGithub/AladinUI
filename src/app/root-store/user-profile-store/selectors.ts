import {createFeatureSelector, createSelector, MemoizedSelector} from '@ngrx/store';
import { State } from './state';
import { User } from 'src/app/shared/models/user';

  const getError = (state: State): any => state.error;
  const getIsLoading = (state: State): boolean => state.isLoading;
  const getUser = (state: State): any => state.user;

  export const selectUserProfileState: MemoizedSelector<object, State>        = createFeatureSelector<State>('UserProfile');
  export const selectUserProfileError: MemoizedSelector<object, any>          = createSelector(selectUserProfileState, getError);
  export const selectUserProfileIsLoading: MemoizedSelector<object, boolean>  = createSelector(selectUserProfileState, getIsLoading);
  export const selectUserProfileUser: MemoizedSelector<object, User>          = createSelector(selectUserProfileState, getUser);

