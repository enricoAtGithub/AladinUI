import { User } from 'src/app/shared/models/user';

export interface State {
    user: User | null;
    error: string;
    isLoading: boolean;
  }

  export const initialState: State = {
    user: null,
    error: null,
    isLoading: false
  };
