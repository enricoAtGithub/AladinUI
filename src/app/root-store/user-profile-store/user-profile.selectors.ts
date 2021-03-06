import {createFeatureSelector, createSelector, MemoizedSelector} from '@ngrx/store';
import { UserProfileState, userProfileStoreKey } from './user-profile.state';
import { User } from 'src/app/shared/models/user';

const getError = (state: UserProfileState): any => {
    // console.log('selector-err-state:', state);
    return state ? state.error : 'no state';
};
// state ? state.error ? state.error : 'state=null' : 'state.error=null';
const getIsLoading = (state: UserProfileState): boolean => state.isInLogin;
const getUser = (state: UserProfileState): any => state.user;
// const isLoggedIn = (state: UserProfileState): any => !!state.user;
const isLoggedIn = (state: UserProfileState): any => state && state.user && state.user.token;

const tokenIsValidated = (state: UserProfileState): any => !!state.tokenIsValidated;

export const selectUserProfileState: MemoizedSelector<object, UserProfileState> = createFeatureSelector<UserProfileState>(userProfileStoreKey);
export const selectUserProfileError: MemoizedSelector<object, any>          = createSelector(selectUserProfileState, getError);
export const selectUserProfileIsLoading: MemoizedSelector<object, boolean>  = createSelector(selectUserProfileState, getIsLoading);
export const selectUserProfileUser: MemoizedSelector<object, User>          = createSelector(selectUserProfileState, getUser);
export const selectIsLoggedIn: MemoizedSelector<object, boolean>  = createSelector(selectUserProfileState, isLoggedIn);
export const selectTokenIsValidated: MemoizedSelector<object, boolean>  = createSelector(selectUserProfileState, tokenIsValidated);


