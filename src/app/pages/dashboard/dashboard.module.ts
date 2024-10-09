import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard.component';
import { ProductsModule } from './products/products.module';
import { DatatableComponent } from 'src/app/core/components/datatable/datatable.component';
import { ConsoleComponent } from './console/console.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { ResultsViewComponent } from './results-view/results-view.component';
import { ResultsComponent } from './results/results.component';
import { AlertNotificationComponent } from 'src/app/core/components/alert-notification/alert-notification.component';
import { RequestResultComponent } from './request-result/request-result.component';
import { SettingsModule } from './settings/settings.module';
import { BrowserModule } from '@angular/platform-browser';
import { HourKpiComponent } from './home/hour-kpi/hour-kpi.component';
import { DayKpiComponent } from './home/day-kpi/day-kpi.component';
import { MonthKpiComponent } from './home/month-kpi/month-kpi.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './profile/profile.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BoxplotKpiComponent } from './home/boxplot-kpi/boxplot-kpi.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AgentComponent } from './agent/agent.component';
import { DragAndDropDirective } from 'src/app/core/directives/drag-and-drop.directive';
import {AppModule} from "../../app.module";
import {PaginationComponent} from "../../core/components/pagination/pagination.component";


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    ConsoleComponent,
    ResultsComponent,
    ResultsViewComponent,
    RequestResultComponent,
    HourKpiComponent,
    DayKpiComponent,
    MonthKpiComponent,
    ProfileComponent,
    BoxplotKpiComponent,
    AgentComponent,
    DragAndDropDirective,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    DashboardRoutingModule,
    ProductsModule,
    ReactiveFormsModule,
    SettingsModule,
    NgxLoadingModule.forRoot({}),
    HighchartsChartModule,
    BrowserAnimationsModule,
    FormsModule,
    CalendarModule,
    NgxPaginationModule,
    AutocompleteLibModule
  ]
})
export class DashboardModule { }
