import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { AccountComponent } from './account/account.component';
import { SecurityComponent } from './security/security.component';
import { LicenseKeysComponent } from './license-keys/license-keys.component';
import { SettingsComponent } from './settings.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    AccountComponent,
    SecurityComponent,
    LicenseKeysComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule
  ]
})
export class SettingsModule { }
