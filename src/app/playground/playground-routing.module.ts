import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseAreaComponent } from './base-area/base-area.component';
import { Routes, RouterModule } from '@angular/router';
import { PermissionTestComponent } from './permission-test/permission-test.component';

const routes: Routes = [
  {path: '', component: BaseAreaComponent},
  {path: 'permission', component: PermissionTestComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PlaygroundRoutingModule { }
