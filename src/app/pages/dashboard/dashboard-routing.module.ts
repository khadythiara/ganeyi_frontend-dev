import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { ResultsComponent } from './results/results.component';
import { ConsoleComponent } from './console/console.component';
import { RequestResultComponent } from './request-result/request-result.component';
import { ProfileComponent } from './profile/profile.component';
import { AgentComponent } from './agent/agent.component';
import { RoleGuard } from 'src/app/core/helpers/role.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'products',
    canActivate: [RoleGuard],
    loadChildren: () => import('./products/products-routing.module').then(m => m.ProductsRoutingModule)
  },
  {
    path: 'console',
    component: ConsoleComponent,
  },
  {
    path: 'requests',
    component: ResultsComponent,
  },
  {
    path: 'request-result/:id',
    component: RequestResultComponent,
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings-routing.module').then(m => m.SettingsRoutingModule)
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'agent',
    canActivate: [RoleGuard],
    component: AgentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
