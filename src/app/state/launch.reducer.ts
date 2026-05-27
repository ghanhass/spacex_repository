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

  on(LaunchActions.loadFavoriteLaunches, (state) => {

    let store_favoriteIds = Array.from(state.favoriteIds);
    if(!store_favoriteIds.length){//store favoriteIds empty ? let's check localstorage
      let ls_favoriteIds = localStorage.getItem("spacex_app_favoriteIds");
      
      if(ls_favoriteIds){//local storage favoriteIds item detected ?
        let parsedItem: string[] = JSON.parse(ls_favoriteIds);
        
        let retrievedFavoriteIds: string[] = !!parsedItem.length ? parsedItem : [];//small check to make sure the parsed favoriteIds from local storage is a valid array, not something else.

        if(retrievedFavoriteIds.length){//final array retrieved from localstorage is not empty ? copy it in the store
          return {...state, favoriteIds: retrievedFavoriteIds}
        }
      }
    }
    return{...state}
    
  }),

  on(LaunchActions.addLaunchToFavorites, (state, { launchId }) => {
    let favoriteIdsArr = Array.from(state.favoriteIds);
    if (!favoriteIdsArr.includes(launchId)) {//only add the favoriteId if it doesn't exist in the store
      favoriteIdsArr.push(launchId);
    }
    localStorage.setItem("spacex_app_favoriteIds", JSON.stringify(favoriteIdsArr));//persist the favoriteIds in the localstorage
    return { ...state , favoriteIds: favoriteIdsArr}
  }),

  on(LaunchActions.removeLaunchFromFavorites, (state, { launchId }) => {
    let favoriteIdsArr = Array.from(state.favoriteIds);
    if (favoriteIdsArr.includes(launchId)) {//only remove the favoriteId if it exists in the store
      let ind = favoriteIdsArr.indexOf(launchId);
      favoriteIdsArr.splice(ind, 1);
    }
    localStorage.setItem("spacex_app_favoriteIds", JSON.stringify(favoriteIdsArr));//persist the favoriteIds in the localstorage
    return { ...state , favoriteIds: favoriteIdsArr}
  }),
);