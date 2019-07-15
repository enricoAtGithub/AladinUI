import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { Routes, RouterModule } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule, CheckboxModule, MessageService, DialogService, ConfirmDialogModule } from 'primeng/primeng';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AddUserDialogComponent } from './components/add-user-dialog/add-user-dialog.component';
import { FormsModule } from '@angular/forms';
import { UpdateUserDialogComponent } from './components/update-user-dialog/update-user-dialog.component';
import { AddEntityDialogComponent } from '../shared/components/add-entity-dialog/add-entity-dialog.component';

// const userRoutes: Routes = [
//   {path: '', component: UserListComponent},
//   {path: 'users-list', component: UserListComponent}
// ];


@NgModule({
  declarations: [UserListComponent, AddUserComponent, UserManagementComponent, AddUserDialogComponent, UpdateUserDialogComponent],
  imports: [
    CommonModule,
    PanelModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    FormsModule,
    CheckboxModule,
    ConfirmDialogModule
    // RouterModule.forChild(userRoutes)
  ],
  providers: [ MessageService, DialogService ],
  entryComponents: [
      AddUserDialogComponent,
      UpdateUserDialogComponent
  ]
})
export class UserModule { }
