import { createAction, props } from '@ngrx/store';

export const loadLaunches = createAction('[Launch List] Load Launches');
export const loadLaunchesSuccess = createAction('[Launch List] Load Success', props<{ launches: any[] }>());
export const loadLaunchesFailure = createAction('[Launch List] Load Failure', props<{ error: any }>());
