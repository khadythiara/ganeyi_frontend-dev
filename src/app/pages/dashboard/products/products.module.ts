import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './products-list/products-list.component';
import { DatatableComponent } from 'src/app/core/components/datatable/datatable.component';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { APP_PRIMENG_COMPONENTS, APP_PRIMENG_MODULE, APP_PRIMENG_PROVIDERS } from 'src/app/app.module-primeng';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [
    ProductsListComponent,
    DatatableComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    APP_PRIMENG_MODULE,
    NgxLoadingModule.forRoot({})
  ],
  providers: [APP_PRIMENG_PROVIDERS]
})
export class ProductsModule { }
