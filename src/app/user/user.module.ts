import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { Routes, RouterModule } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule, CheckboxModule } from 'primeng/primeng';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { FormsModule } from '@angular/forms';

// const userRoutes: Routes = [
//   {path: '', component: UserListComponent},
//   {path: 'users-list', component: UserListComponent}
// ];


@NgModule({
  declarations: [UserListComponent, AddUserComponent, UserManagementComponent],
  imports: [
    CommonModule,
    PanelModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    FormsModule,
    CheckboxModule
    // RouterModule.forChild(userRoutes)
  ]
})
export class UserModule { }
