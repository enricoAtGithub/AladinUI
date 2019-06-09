import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';

import { LoginComponent } from './auth/components/login/login.component';
import { UserModule } from './user/user.module';
import { UserListComponent } from './user/components/user-list/user-list.component';
import { UserManagementComponent } from './user/components/user-management/user-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { ReportsComponent } from './reports/reports.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ProfileComponent } from './profile/profile.component';

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
        {path: 'administration', children: [
            {path: '', pathMatch: 'full', component: UserManagementComponent}
        ]}
      ]
    },

    // No-Layout routes
    { path: 'login', component: LoginComponent },

    { path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
