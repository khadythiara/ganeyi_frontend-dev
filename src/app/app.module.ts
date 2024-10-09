import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NgToastModule } from 'ng-angular-popup';
import { NgxLoadingModule } from "ngx-loading";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { AuthModule } from './pages/auth/auth.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { SignupModule } from './pages/signup/signup.module';
import { ForgottenpasswordComponent } from './pages/forgottenpassword/forgottenpassword.component';
import { APP_PRIMENG_MODULE, APP_PRIMENG_PROVIDERS } from './app.module-primeng';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { AgentinvitationComponent } from './pages/agentinvitation/agentinvitation.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    ForgottenpasswordComponent,
    AgentinvitationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    SignupModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule,
    NgxLoadingModule.forRoot({}),
    NgToastModule,
    APP_PRIMENG_MODULE
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS}, JwtHelperService, APP_PRIMENG_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
