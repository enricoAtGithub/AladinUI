import { User } from 'src/app/shared/models/user';

export interface UserProfileState {
    user: User | null;
    error: string;
    isInLogin: boolean;
    isInLogout: boolean; // find better wording. There is no good verb for logout. ending session?
  }

  export const initialState: UserProfileState = {
    user: null,
    error: null,
    isInLogin: false,
    isInLogout: false
  };
