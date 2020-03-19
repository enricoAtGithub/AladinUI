import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseAreaComponent } from './base-area/base-area.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', component: BaseAreaComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PlaygroundRoutingModule { }
