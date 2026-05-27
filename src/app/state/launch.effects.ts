import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SpacexService } from '../services/spacex';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { Launch } from '../interfaces/interfaces';
import * as appActions from '../state/launch.actions';


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

                    catchError((errorRes: string) =>
                        of(
                            appActions.loadLaunchesFailure({
                                error: errorRes
                            })
                        )
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
}