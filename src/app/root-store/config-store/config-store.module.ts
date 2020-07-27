import { StoreModule } from '@ngrx/store';
import { configReducer, CONFIG_PROFILE_REDUCER } from './config.reducer';
import { ConfigEffects } from './config.effects';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { configStoreKey } from './config.state';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(configStoreKey, CONFIG_PROFILE_REDUCER),
        EffectsModule.forFeature([ConfigEffects])
    ],
    providers: [
        ConfigEffects,
        {
            provide: CONFIG_PROFILE_REDUCER, useValue: configReducer
        }
    ]
})
export class ConfigurationStoreModule { }
