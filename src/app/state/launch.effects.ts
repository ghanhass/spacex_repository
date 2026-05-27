import { inject, Injectable, Signal } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SpacexService } from '../services/spacex';
import { catchError, EMPTY, exhaustMap, map, of, switchMap } from 'rxjs';
import { Launch } from '../interfaces/interfaces';
import * as appActions from './launch.actions';


@Injectable()
export class LaunchEffects {

    private spaceXService = inject(SpacexService);
    private actions$ = inject(Actions);

    /**
     * Helper method to handle Errors from api calls
     * @param errorRes Error object, can be a Not Found error in the form of {error: string} when fetching a wrong launch Id, or an error in the form of { error: ProgressEvent } related to e.g fails with calling the API altogether.
     * @returns Observable of either loadLaunchesFailure action or loadLaunchesFailure action
     */
    private handleError(errorRes: { error: string | ProgressEvent }) {
        if (errorRes.error instanceof ProgressEvent) {
            return of(
                appActions.loadLaunchesFailure({
                    error: "Unknown API error"
                })
            );
        }
        else {
            return of(
                appActions.loadLaunchesFailure({
                    error: errorRes.error
                })
            );
        }
    }

    /**
     * Effect for handling loading launches list => loadLaunchesSuccess action || loadLaunchesFailure action
     */
    loadLaunches$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(appActions.loadLaunches),
            exhaustMap(() =>
                this.spaceXService.getPastLaunches().pipe(
                    map((res: Launch[]) => appActions.loadLaunchesSuccess({
                        launches: res
                    })),

                    catchError((errorRes: { error: string | ProgressEvent }) => {
                        return this.handleError(errorRes);
                    }
                    )
                )
            )
        )
    });

    /**
     * Effect for handling loading launch details => loadLaunchesSuccess action || loadLaunchesFailure action
     */
    loadLaunchDetail$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(appActions.loadLaunchDetail),
            exhaustMap((action) =>
                this.spaceXService.getLaunchById(action.launchId).pipe(
                    map((res: Launch) => appActions.loadLaunchesSuccess({
                        launches: [res]
                    })),

                    catchError((errorRes: { error: string | ProgressEvent }) => {
                        return this.handleError(errorRes);
                    }
                    )
                )
            )
        )
    });

    /**
     * Effect to show notifications on data load errors
     */
    loadLaunchesFailure$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(appActions.loadLaunchesFailure),
            switchMap((action) => {
                this.spaceXService.openSnackBar(action.error, "Error");
                return EMPTY
            })

        )
    }, { dispatch: false }
    );

}