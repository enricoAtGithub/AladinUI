import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './auth/guards/auth.guard';

import { LoginComponent } from './auth/components/login/login.component';
import { UserManagementComponent } from './user/components/user-management/user-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ProfileComponent } from './profile/profile.component';
import { CatalogueManagementComponent } from './user/components/catalogue-management/catalogue-management.component';
import { UserManagementGuard } from './auth/guards/user-management.guard';
import { LoginGuard } from './auth/guards/login.guard';
import { DTOConfigEditorComponent } from './jmeleon/components/dtoconfig-editor/dtoconfig-editor.component';
import { SettingsComponent } from './jmeleon/modules/settings/components/settings/settings.component';
import { SchedulerComponent } from './jmeleon/modules/scheduler/components/scheduler/scheduler.component';
import { PlaygroundGuard } from './playground/guards/playground.guard';
import { AvailabilityComponent } from './jmeleon/modules/scheduler/components/availability/availability.component';
import { DTOEntitiesComponent } from './jmeleon/components/dto-entities/dto-entities.component';
import { ScriptActionsComponent } from './jmeleon/components/script-actions/script-actions.component';
import { EntityViewComponent } from './shared/components/entity-view/entity-view.component';

export const routes: Routes = [
  // App-Layout routes
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'masterdata',
        children: [
          { path: 'products', pathMatch: 'full', component: EntityViewComponent, data: { entityType: 'Product', displayName: 'Produkte' } },
          { path: 'accounts', pathMatch: 'full', component: EntityViewComponent, data: { entityType: 'Account', displayName: 'Accounts' } },
        ]
      },
      {
        path: 'sales',
        children: [
          { path: 'quotations', pathMatch: 'full', component: EntityViewComponent, data: { entityType: 'Quotation', displayName: 'Angebote' } },
          { path: 'orders', pathMatch: 'full', component: EntityViewComponent, data: { entityType: 'Order', displayName: 'Aufträge' } },
        ]
      },
      { path: 'reports', component: ReportsComponent },
      { path: 'invoices', component: EntityViewComponent, data: { entityType: 'Invoice', displayName: 'Rechnungen' } },
      { path: 'profile', component: ProfileComponent },
      { path: 'scheduler', component: SchedulerComponent },
      {
        path: 'resource-management',
        children: [
          { path: 'resources', pathMatch: 'full', component: EntityViewComponent, data: { entityType: 'Resource', displayName: 'Ressourcen' } },
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
          { path: 'useralt-management', pathMatch: 'full', component: EntityViewComponent, data: { entityType: 'User', displayName: 'Benutzer' } },
          { path: 'role-management', pathMatch: 'full', component: EntityViewComponent, data: { entityType: 'SecurityRole', displayName: 'Rollenverwaltung' } },
          { path: 'permission-management', pathMatch: 'full', component: EntityViewComponent, data: { entityType: 'SecurityRight', displayName: 'Rechteverwaltung' } },
        ]
      },
      {
        path: 'configuration',
        children: [
          { path: 'catalogue-management', pathMatch: 'full', component: CatalogueManagementComponent },
          { path: 'dto-configuration', pathMatch: 'full', component: DTOConfigEditorComponent },
          { path: 'actions', pathMatch: 'full', component: ScriptActionsComponent },
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

