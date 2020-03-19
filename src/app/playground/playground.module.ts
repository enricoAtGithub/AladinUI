import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseAreaComponent } from './base-area/base-area.component';
import { Routes, RouterModule } from '@angular/router';
import { PlaygroundRoutingModule } from './playground-routing.module';
import { PermissionTestComponent } from './permission-test/permission-test.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [BaseAreaComponent, PermissionTestComponent],
  imports: [
    CommonModule,
    PlaygroundRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ]
})
export class PlaygroundModule { }
