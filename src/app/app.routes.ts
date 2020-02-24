import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';

import { LoginComponent } from './auth/components/login/login.component';
import { UserModule } from './user/user.module';
import { UserManagementComponent } from './user/components/user-management/user-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { ReportsComponent } from './reports/reports.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ProfileComponent } from './profile/profile.component';
import { RoleManagementComponent } from './user/components/role-management/role-management.component';
import { PermissionManagementComponent } from './user/components/permission-management/permission-management.component';
import { CatalogueManagementComponent } from './user/components/catalogue-management/catalogue-management.component';
import { UserManagementGuard } from './auth/user-management.guard';

export const routes: Routes = [
    // App-Layout routes
    { path: '',
      component: AppLayoutComponent,
      canActivate: [AuthGuard],
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        { path: 'dashboard', component: DashboardComponent},
        { path: 'orders', component: OrdersComponent},
        { path: 'reports', component: ReportsComponent},
        { path: 'invoices', component: InvoicesComponent},
        { path: 'profile', component: ProfileComponent},
        // doesn't seem to work with 'ModuleWithProviders
        // {path: 'administration', loadChildren: './user/user.module.ts#UserModule'}
        // {path: 'administration', loadChildren: UserModule}
        {path: 'administration',
        canActivate: [UserManagementGuard],
        children: [
          {path: 'user-management', pathMatch: 'full', component: UserManagementComponent},
          {path: 'role-management', pathMatch: 'full', component: RoleManagementComponent},
          {path: 'permission-management', pathMatch: 'full', component: PermissionManagementComponent},
          {path: 'catalogue-management', pathMatch: 'full', component: CatalogueManagementComponent},
        ]}
      ]
    },

    // No-Layout routes
    { path: 'login', component: LoginComponent },

    { path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
