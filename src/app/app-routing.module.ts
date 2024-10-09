import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthModule } from './pages/auth/auth.module';
import { DashboardRoutingModule } from './pages/dashboard/dashboard-routing.module';
import { AuthRoutingModule } from './pages/auth/auth-routing.module';
import { SignupRoutingModule } from './pages/signup/signup-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/dashboard/home/home.component';
import { AuthGuard } from './core/helpers/auth.guard';
import { ForgottenpasswordRoutingModule } from './pages/forgottenpassword/forgottenpassword-routing.module';
import { AgentinvitationComponent } from './pages/agentinvitation/agentinvitation.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => DashboardRoutingModule,
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => AuthRoutingModule,
  },
  {
    path: 'signup',
    loadChildren: () => SignupRoutingModule,
  },
  {
    path: 'forgettenpassword',
    loadChildren: () => ForgottenpasswordRoutingModule,
  },
  {
    path: 'agent-invitation/:code',
    component: AgentinvitationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
