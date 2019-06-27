import { User } from 'src/app/shared/models/user';

export interface UserProfileState {
  user: User | null;
  error: string;
  isInLogin: boolean;
  isInLogout: boolean;
}

export const initialState: UserProfileState = {
  user: null,
  error: null,
  isInLogin: false,
  isInLogout: false
};
