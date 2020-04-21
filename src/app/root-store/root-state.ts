import * as fromUserProfileState from './user-profile-store/state';
import * as fromConfigState from './config-store/state';

export interface State {
    userProfile: fromUserProfileState.UserProfileState;
    config: fromConfigState.ConfigState;
}

export const initialRootState: State = {
    userProfile: fromUserProfileState.initialState,
    config: fromConfigState.initialState,
};
