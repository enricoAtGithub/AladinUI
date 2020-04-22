import { Injectable } from '@angular/core';
import { EntityService } from '../../shared/services/entity.service';
import * as configActions from './actions';
import { Observable } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class ConfigEffects {
    constructor(private entityService: EntityService, private actions$: Actions) {}

    @Effect()
    configsLoadRequestEffect$: Observable<Action> = this.actions$.pipe(
        ofType<configActions.ConfigsLoadRequestAction>(
            configActions.ActionTypes.CONFIG_LOAD_REQUEST
        ),
        switchMap(_ => this.entityService.getEntityConfigurations().pipe(
            map(configs =>  {
                return new configActions.ConfigsLoadAction({configs});
            })
        ))
    );

    @Effect()
    groupConfigsLoadRequestEffect$: Observable<Action> = this.actions$.pipe(
        ofType<configActions.GroupConfigsLoadRequestAction>(
            configActions.ActionTypes.GROUP_CONFIG_LOAD_REQUEST
        ),
        switchMap(_ => this.entityService.getGroupConfigurations().pipe(
            map(configs =>  {
                return new configActions.GroupConfigsLoadAction({configs});
            })
        ))
    );

}
