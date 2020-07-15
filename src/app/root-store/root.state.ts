import * as fromUserProfileState from './user-profile-store/user-profile.state';
import * as fromConfigState from './config-store/config.state';

export interface State {
    userProfile: fromUserProfileState.UserProfileState;
    config: fromConfigState.ConfigState;
}

export const initialRootState: State = {
    userProfile: fromUserProfileState.initialState,
    config: fromConfigState.initialState,
};
