import { createReducer, on } from '@ngrx/store';
import * as LaunchActions from './launch.actions';
import { Launch } from '../interfaces/interfaces';

export interface LaunchState {
  launches: Launch[];
  favoriteIds: string[];
  loading: boolean;
  error: string | null;
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

  on(LaunchActions.loadLaunchDetail, state => ({ ...state, loading: true })),
  on(LaunchActions.addLaunchToFavorites, (state, { launchId }) => {
    let favoriteIdsArr = state.favoriteIds;
    if (!favoriteIdsArr.includes(launchId)) {
      favoriteIdsArr.push(launchId);
    }
    return { ...state , favoriteIds: favoriteIdsArr}
  }),

  on(LaunchActions.removeLaunchFromFavorites, (state, { launchId }) => {
    let favoriteIdsArr = state.favoriteIds;
    if (favoriteIdsArr.includes(launchId)) {
      let ind = favoriteIdsArr.indexOf(launchId);
      favoriteIdsArr.splice(ind, 1);
    }
    return { ...state , favoriteIds: favoriteIdsArr}
  }),
);