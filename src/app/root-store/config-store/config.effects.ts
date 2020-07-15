import { Injectable } from '@angular/core';
import { EntityService } from '../../shared/services/entity.service';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import * as ConfigActions from './config.actions';

@Injectable()
export class ConfigEffects {
    constructor(private entityService: EntityService, private actions$: Actions) {}

    loadConfigs$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ConfigActions.loadConfigsRequested),
            switchMap(_ => this.entityService.getEntityConfigurations().pipe(
                map(configs =>  {
                    return ConfigActions.loadConfigsSucceeded({configs});
                })
            ))
        )
    );

    loadGroupConfigs$ = createEffect(() => 
        this.actions$.pipe(
            ofType(ConfigActions.loadGroupConfigsRequested),
            switchMap(_ => this.entityService.getGroupConfigurations().pipe(
                map(configs =>  {
                    return ConfigActions.loadGroupConfigsSucceeded({configs});
                })
            )
    )));

}
