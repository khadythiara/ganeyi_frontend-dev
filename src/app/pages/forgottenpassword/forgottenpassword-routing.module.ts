import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgottenpasswordComponent } from './forgottenpassword.component';

const routes: Routes = [
  {
    path: '',
    component: ForgottenpasswordComponent,
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgottenpasswordRoutingModule { }
