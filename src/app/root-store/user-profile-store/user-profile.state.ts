import { User } from 'src/app/shared/models/user';

export interface UserProfileState {
  user: User | null;
  error: string;
  isInLogin: boolean;
  isInLogout: boolean;
}

export const initialState: UserProfileState = {
  user: null,
  error: '',
  isInLogin: false,
  isInLogout: false
};

export const userProfileStoreKey = 'userProfile';
