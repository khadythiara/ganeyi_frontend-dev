import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { LicenseKeysComponent } from './license-keys/license-keys.component';
import { SecurityComponent } from './security/security.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        component: AccountComponent,
        outlet: 'settings'
      }
    ]
  },
  {
    path: 'account',
    component: SettingsComponent,
    children: [
      {
        path: '',
        component: AccountComponent,
        outlet: 'settings'
      }
    ]
  },
  {
    path: 'security',
    component: SettingsComponent,
    children: [
      {
        path: '',
        component: SecurityComponent,
        outlet: 'settings'
      }
    ]
  },
  {
    path: 'keys',
    component: SettingsComponent,
    children: [
      {
        path: '',
        component: LicenseKeysComponent,
        outlet: 'settings'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
