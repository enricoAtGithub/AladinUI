import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';

import { LoginComponent } from './auth/components/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { ReportsComponent } from './reports/reports.component';
import { InvoicesComponent } from './invoices/invoices.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'assignments', component: AssignmentsComponent, canActivate: [AuthGuard]},
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard]},
    { path: 'invoices', component: InvoicesComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
