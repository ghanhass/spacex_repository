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

    private handleError(errorRes: { error: string | ProgressEvent }) {
        console.log("errorRes = ", errorRes);
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

    loadLaunchesFailure$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(appActions.loadLaunchesFailure),
            switchMap((action) => {
                this.spaceXService.openSnackBar(action.error, "Error");
                return EMPTY
            })

        )
    }, { dispatch: false }
    )
}