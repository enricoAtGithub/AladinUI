import { Action, createReducer, on } from '@ngrx/store';


export const pageStateFeatureKey = 'pageState';

export interface State {

}

export const initialState: State = {

};

const pageStateReducer = createReducer(
  initialState,

);

export function reducer(state: State | undefined, action: Action) {
  return pageStateReducer(state, action);
}
