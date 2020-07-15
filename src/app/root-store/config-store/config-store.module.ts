import { StoreModule } from '@ngrx/store';
import { configReducer } from './config.reducer';
import { ConfigEffects } from './config.effects';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature('config', configReducer),
        EffectsModule.forFeature([ConfigEffects])
    ]
})
export class ConfigurationStoreModule { }
