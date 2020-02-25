import {createFeatureSelector, createSelector, MemoizedSelector} from '@ngrx/store';
import { UserProfileState } from './state';
import { User } from 'src/app/shared/models/user';

const getError = (state: UserProfileState): any => {
    // console.log('selector-err-state:', state);
    return state ? state.error : 'no state';
};
// state ? state.error ? state.error : 'state=null' : 'state.error=null';
const getIsLoading = (state: UserProfileState): boolean => state.isInLogin;
const getUser = (state: UserProfileState): any => state.user;

export const selectUserProfileState: MemoizedSelector<object, UserProfileState> = createFeatureSelector<UserProfileState>('userProfile');
export const selectUserProfileError: MemoizedSelector<object, any>          = createSelector(selectUserProfileState, getError);
export const selectUserProfileIsLoading: MemoizedSelector<object, boolean>  = createSelector(selectUserProfileState, getIsLoading);
export const selectUserProfileUser: MemoizedSelector<object, User>          = createSelector(selectUserProfileState, getUser);


