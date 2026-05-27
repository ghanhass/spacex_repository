import { createAction, props } from '@ngrx/store';
import { Launch } from '../interfaces/interfaces';

export const loadLaunches = createAction('[Launch List] Load Launches');
export const loadLaunchesSuccess = createAction('[Launch List] Load Success', props<{ launches: Launch[] }>());
export const loadLaunchesFailure = createAction('[Launch List] Load Failure', props<{ error: string }>());

export const loadLaunchDetail = createAction("[Launch] Load Launch Details", props<{launchId: string}>());

export const loadFavoriteLaunches = createAction('[Launch List] Load Favorite Launches');
export const addLaunchToFavorites = createAction("[Launch] Add to Favorites", props<{launchId: string}>());
export const removeLaunchFromFavorites = createAction("[Launch] Remove From Favorites", props<{launchId: string}>());