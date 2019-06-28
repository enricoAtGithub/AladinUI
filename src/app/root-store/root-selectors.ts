import { MemoizedSelector, createSelector } from '@ngrx/store';
import { UserProfileSelectors } from './user-profile-store/user-profile-index';

export const selectError: MemoizedSelector<object, string> =
    createSelector(UserProfileSelectors.selectUserProfileError, (userProfileError: string) => userProfileError);

// add loading selector

