import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseAreaComponent } from './base-area/base-area.component';
import { Routes, RouterModule } from '@angular/router';
import { PermissionTestComponent } from './permission-test/permission-test.component';
import { EntityTestComponent } from './entity-test/entity-test.component';
import { DateFormatComponent } from './date-format/date-format.component';

const routes: Routes = [
  {path: '', component: BaseAreaComponent, pathMatch: 'full'},
  {path: 'permission', component: PermissionTestComponent},
  {path: 'entity-test', component: EntityTestComponent},
  {path: 'date-format', component: DateFormatComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PlaygroundRoutingModule { }
