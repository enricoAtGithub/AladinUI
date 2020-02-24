import * as fromUserProfileState from './user-profile-store/state';

export interface State {
    userProfile: fromUserProfileState.UserProfileState;
}

export const initialRootState: State = {
    userProfile: fromUserProfileState.initialState,
};
