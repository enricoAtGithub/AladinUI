import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule, CheckboxModule, MessageService, DialogService, ConfirmDialogModule, DropdownModule,
  TreeTableModule } from 'primeng/primeng';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AddUserDialogComponent } from './components/add-user-dialog/add-user-dialog.component';
import { FormsModule } from '@angular/forms';
import { UpdateUserDialogComponent } from './components/update-user-dialog/update-user-dialog.component';
import { PermissionManagementComponent } from './components/permission-management/permission-management.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { SharedModule } from '../shared/shared.module';
import { CatalogueManagementComponent } from './components/catalogue-management/catalogue-management.component';

@NgModule({
  declarations: [
    UserListComponent,
    AddUserComponent,
    UserManagementComponent,
    AddUserDialogComponent,
    UpdateUserDialogComponent,
    RoleManagementComponent,
    PermissionManagementComponent,
    CatalogueManagementComponent
  ],
  imports: [
    CommonModule,
    PanelModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    FormsModule,
    CheckboxModule,
    ConfirmDialogModule,
    SharedModule,
    DropdownModule,
    TreeTableModule,
  ],
  providers: [ MessageService, DialogService ],
  entryComponents: [
      AddUserDialogComponent,
      UpdateUserDialogComponent
  ]
})
export class UserModule { }
