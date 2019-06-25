import {createFeatureSelector, createSelector, MemoizedSelector} from '@ngrx/store';
import { UserProfileState } from './state';
import { User } from 'src/app/shared/models/user';

const getError = (state: UserProfileState): any => state.error;
const getIsLoading = (state: UserProfileState): boolean => state.isInLogin;
const getUser = (state: UserProfileState): any => state.user;

export const selectUserProfileState: MemoizedSelector<object, UserProfileState> = createFeatureSelector<UserProfileState>('UserProfile');
export const selectUserProfileError: MemoizedSelector<object, any>          = createSelector(selectUserProfileState, getError);
export const selectUserProfileIsLoading: MemoizedSelector<object, boolean>  = createSelector(selectUserProfileState, getIsLoading);
export const selectUserProfileUser: MemoizedSelector<object, User>          = createSelector(selectUserProfileState, getUser);


