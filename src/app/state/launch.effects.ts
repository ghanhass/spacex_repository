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
}