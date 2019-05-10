import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';

import { LoginComponent } from './auth/components/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignmentsComponent } from './assignments/assignments.component';
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
        { path: 'assignments', component: AssignmentsComponent},
        { path: 'reports', component: ReportsComponent},
        { path: 'invoices', component: InvoicesComponent},
        { path: 'profile', component: ProfileComponent},
      ]
    },

    // No-Layout routes
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
