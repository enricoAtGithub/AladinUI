import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './auth/guards/auth.guard';

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
import { UseraltComponent } from './useralt/useralt.component';
import { UserManagementGuard } from './auth/guards/user-management.guard';
import { LoginGuard } from './auth/guards/login.guard';
import { DTOConfigEditorComponent } from './jmeleon/components/dtoconfig-editor/dtoconfig-editor.component';
import { SettingsComponent } from './jmeleon/modules/settings/components/settings/settings.component';
import { ResourcesComponent } from './jmeleon/components/resources/resources.component';
import { SchedulerComponent } from './jmeleon/modules/scheduler/components/scheduler/scheduler.component';
import { environment } from 'src/environments/environment';
import { PlaygroundGuard } from './playground/guards/playground.guard';
import { AvailabilityComponent } from './jmeleon/modules/scheduler/components/availability/availability.component';
import { DTOEntitiesComponent } from './jmeleon/components/dto-entities/dto-entities.component';


export const routes: Routes = [
  // App-Layout routes
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'scheduler', component: SchedulerComponent },
      // doesn't seem to work with 'ModuleWithProviders
      // {path: 'administration', loadChildren: './user/user.module.ts#UserModule'}
      // {path: 'administration', loadChildren: UserModule},
      {
        path: 'resource-management',
        children: [
          { path: 'resources', pathMatch: 'full', component: ResourcesComponent },
          { path: 'availability', pathMatch: 'full', component: AvailabilityComponent },
        ]
      },
      { path: 'dto-entities', component: DTOEntitiesComponent },
      {
        path: 'playground',
        loadChildren: () => import('./playground/playground.module').then(m => m.PlaygroundModule),
        canLoad: [PlaygroundGuard]
      },
      {
        path: 'administration',
        canActivate: [UserManagementGuard],
        children: [
          { path: 'user-management', pathMatch: 'full', component: UserManagementComponent },
          { path: 'useralt-management', pathMatch: 'full', component: UseraltComponent },
          { path: 'role-management', pathMatch: 'full', component: RoleManagementComponent },
          { path: 'permission-management', pathMatch: 'full', component: PermissionManagementComponent },
          { path: 'catalogue-management', pathMatch: 'full', component: CatalogueManagementComponent },
          { path: 'dto-configuration', pathMatch: 'full', component: DTOConfigEditorComponent },
          { path: 'settings', component: SettingsComponent }
        ]
      }
    ]
  },

  // No-Layout routes
  { path: 'login', canActivate: [LoginGuard], component: LoginComponent },

  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(
  routes,
  { scrollPositionRestoration: 'enabled' });

