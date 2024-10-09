import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { APP_PRIMENG_MODULE } from 'src/app/app.module-primeng';
import { ModalMsgComponent } from 'src/app/core/components/modal-msg/modal-msg.component';


@NgModule({
  declarations: [
    AuthComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ModalMsgComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    NgxLoadingModule.forRoot({}),
    APP_PRIMENG_MODULE
  ]
})
export class AuthModule { }
