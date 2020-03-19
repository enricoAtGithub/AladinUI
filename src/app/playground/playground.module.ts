import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseAreaComponent } from './base-area/base-area.component';
import { Routes, RouterModule } from '@angular/router';
import { PlaygroundRoutingModule } from './playground-routing.module';

@NgModule({
  declarations: [BaseAreaComponent],
  imports: [
    CommonModule,
    PlaygroundRoutingModule
  ]
})
export class PlaygroundModule { }
