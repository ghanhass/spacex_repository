import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { launchReducer } from './state/launch.reducer';
import { LaunchEffects } from './state/launch.effects';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    
    provideStore({ launch: launchReducer }),
    
    provideEffects([LaunchEffects]),

    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    })
  ]
};
