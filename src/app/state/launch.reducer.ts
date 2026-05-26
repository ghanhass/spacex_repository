import { createReducer, on } from '@ngrx/store';
import * as LaunchActions from './launch.actions';

export interface LaunchState {
  launches: any[];
  favoriteIds: string[];
  loading: boolean;
  error: any;
}

export const initialState: LaunchState = {
  launches: [],
  favoriteIds: [],
  loading: false,
  error: null
};

export const launchReducer = createReducer(
  initialState,
  on(LaunchActions.loadLaunches, state => ({ ...state, loading: true })),
  on(LaunchActions.loadLaunchesSuccess, (state, { launches }) => ({ ...state, loading: false, launches })),
  on(LaunchActions.loadLaunchesFailure, (state, { error }) => ({ ...state, loading: false, error })),
);