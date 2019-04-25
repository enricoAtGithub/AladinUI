import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent } from './auth/components/login/login.component';
import { UserModule } from './user/user.module';
import { UserListComponent } from './user/components/user-list/user-list.component';
import { UserManagementComponent } from './user/components/user-management/user-management.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    // doesn't seem to work with 'ModuleWithProviders
    // {path: 'administration', loadChildren: './user/user.module.ts#UserModule'}
    // {path: 'administration', loadChildren: UserModule}
    {path: 'administration', children: [
        {path: '', pathMatch: 'full', component: UserManagementComponent}
    ]}
];

export const AppRoutes: ModuleWithProviders = 
RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
