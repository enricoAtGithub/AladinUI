import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseAreaComponent } from './base-area/base-area.component';
import { Routes, RouterModule } from '@angular/router';
import { PlaygroundRoutingModule } from './playground-routing.module';
import { PermissionTestComponent } from './permission-test/permission-test.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from '../shared/shared.module';
import { PermissionsModule } from '../jmeleon/modules/permissions/permissions.module';
import { EntityTestComponent } from './entity-test/entity-test.component';
import { DateFormatComponent } from './date-format/date-format.component';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/primeng';

@NgModule({
  declarations: [BaseAreaComponent, PermissionTestComponent, EntityTestComponent, DateFormatComponent],
  imports: [
    CommonModule,
    PlaygroundRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild({
      permissionsIsolate: false,
      rolesIsolate: false
    }),
    PermissionsModule,
    TabViewModule,
    AccordionModule
  ]
})
export class PlaygroundModule { }
