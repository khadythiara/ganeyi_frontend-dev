import { Component, OnInit } from '@angular/core';
import { INDEX_DATA_MAPPING } from 'src/app/core/constants';
import { Client } from 'src/app/core/models/Client';
import { ClientKpi } from 'src/app/core/models/ClientKpi';
import { Product } from 'src/app/core/models/Product';
import { ProductApiRequestService } from 'src/app/core/services/product-api-request.service';
import { UserService } from 'src/app/core/services/user.service';
import { FilterType, SuggestionType } from 'src/app/core/utils/types';
import { Utils } from 'src/app/core/utils/Utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAccountActive = false;
  products: Array<Product> = [];
  clientId: any;
  totalRequestForCurrentHour = 0;
  totalRequestForCurrentDay = 0;
  totalRequestForCurrentMonth = 0;
  currentDate = new Date();
  public loadingComponent = true;
  selectedProductId = "";
  requestStatus = "";
  isAgent: Boolean = false;

  data: ClientKpi = {
    byHour: {
      loading: true,
      data: []
    },
    byDay: {
      loading: true,
      data: []
    },
    byMonth: {
      loading: true,
      data: []
    },
    durationHour: {
      loading: true,
      data: []
    },
    durationDay: {
      loading: true,
      data: []
    },
    durationMonth: {
      loading: true,
      data: []
    },
    total: {
      loading: true,
      data: []
    }
  };

  dateFilter = {
    hourly: {
      loading: false,
      value: new Date(this.currentDate),
    },
    daily: {
      loading: false,
      value: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1),
      yearRange: `2019:${this.utils.nextYear}`,
    },
    monthly: {
      loading: false,
      value: new Date(this.utils.currentYear),
      interval: {
        maxDate: null,
      },
    },
  };

  constructor(private userService: UserService, private productApiRequestService: ProductApiRequestService, private utils: Utils) { }

  ngOnInit(): void {
    this.isAgent = this.utils.isAgent()
    this.initializeFilter();
    this.selectedProductId = "";
    this.requestStatus = "";
    if (this.isAgent) {
      this.userService.getAgentAccount().subscribe(
        (response: any) => {
          response.isActive ? this.isAccountActive = true : this.isAccountActive = false
          this.clientId = response.client.id
          this.products = response.client.products;
          this.productApiRequestService.getClientKpiData(this.clientId)
            .subscribe((response: any) => {
              Object.keys(response).forEach((key: string) => {
                this.data[key] = {
                  data: response[key],
                  loading: false,
                };
              });
              // Information on current hour, day and month
              this.setDailyBasisInfo();
              // Disable loading on KPIs
              this.disableKpiLoading();
            }
            );
          this.loadingComponent = false;
        },
        (err) => {
          alert(err.message)
        }
      )
    }
    else {
      this.userService.getCustomerFromUserAccount().subscribe(
        (response: Client) => {
          this.clientId = response.id
          this.products = response.products;
          response.isActive ? this.isAccountActive = true : this.isAccountActive = false
          this.productApiRequestService.getClientKpiData(this.clientId)
            .subscribe((response: any) => {
              Object.keys(response).forEach((key: string) => {
                this.data[key] = {
                  data: response[key],
                  loading: false,
                };
              });
              // Information on current hour, day and month
              this.setDailyBasisInfo();
              // Disable loading on KPIs
              this.disableKpiLoading();
            }
            );
          this.loadingComponent = false;
        }
      )

    }
  }

  refresh(): void {
    this.ngOnInit();
  }

  dateFilterSelected(type: FilterType) {
    const beginAt = this.dateFilter[type].value;

    this.dateFilter[type].loading = true;
    this.productApiRequestService.getClientKpiData(this.clientId, type, this.utils.formatDate(beginAt), this.selectedProductId, this.requestStatus)
      .subscribe(response => {
        this.data[INDEX_DATA_MAPPING[type][0]] = {
          loading: false,
          data: response[INDEX_DATA_MAPPING[type][0]]
        };
        this.data[INDEX_DATA_MAPPING[type][1]] = {
          loading: false,
          data: response[INDEX_DATA_MAPPING[type][1]]
        };
        this.dateFilter[type].loading = false;
      });

  }

  filterSuggestion(kpi: FilterType, direction: SuggestionType) {
    this.dateFilter[kpi].loading = true;

    switch (kpi) {
      case 'hourly':
        if (direction === 'previous') {
          this.dateFilter[kpi].value = this.utils.dateAdd(this.dateFilter[kpi].value, -1, 'day');
        }
        else {
          this.dateFilter[kpi].value = new Date(this.currentDate);
        }
        break;

      case 'daily':
        if (direction === 'previous') {
          this.dateFilter[kpi].value = this.utils.dateAdd(this.dateFilter[kpi].value, -1, 'month');
        }
        else {
          this.dateFilter[kpi].value = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        }
        break;

      case 'monthly':
        if (direction === 'previous') {
          this.dateFilter[kpi].value = this.utils.dateAdd(this.dateFilter[kpi].value, -1, 'year');
        }
        else {
          this.dateFilter[kpi].value = new Date(this.utils.currentYear);
        }
        break;

      default:
        break;
    }

    this.productApiRequestService.getClientKpiData(
      this.clientId,
      kpi,
      this.utils.formatDate(this.dateFilter[kpi].value),
      this.selectedProductId,
      this.requestStatus
    )
      .subscribe(response => {
        this.data[INDEX_DATA_MAPPING[kpi][0]] = {
          loading: false,
          data: response[INDEX_DATA_MAPPING[kpi][0]]
        };
        this.data[INDEX_DATA_MAPPING[kpi][1]] = {
          loading: false,
          data: response[INDEX_DATA_MAPPING[kpi][1]]
        };
        this.dateFilter[kpi].loading = false;
      });
  }

  filterProduct(): void {
    this.initializeFilter();
    this.productApiRequestService.getClientKpiData(this.clientId, undefined, undefined, this.selectedProductId, this.requestStatus)
      .subscribe(response => {
        Object.keys(response).forEach((key: string) => {
          this.data[key] = {
            data: response[key],
            loading: false,
          };
        });
        this.setDailyBasisInfo();
        this.disableKpiLoading();
      });
  }

  filterByStatus(): void {
    this.initializeFilter();
    this.productApiRequestService.getClientKpiData(this.clientId, undefined, undefined, this.selectedProductId, this.requestStatus)
      .subscribe(response => {
        Object.keys(response).forEach((key: string) => {
          this.data[key] = {
            data: response[key],
            loading: false,
          };
        });
        this.setDailyBasisInfo();
        this.disableKpiLoading();
      });
  }

  private initializeFilter(): void {
    this.dateFilter = {
      hourly: {
        loading: true,
        value: new Date(),
      },
      daily: {
        loading: true,
        value: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1),
        yearRange: `2019:${this.utils.nextYear}`,
      },
      monthly: {
        loading: true,
        value: new Date(this.utils.currentYear),
        interval: {
          maxDate: null,
        },
      },
    };
  }

  private disableKpiLoading(): void {
    this.dateFilter.hourly.loading = false;
    this.dateFilter.monthly.loading = false;
    this.dateFilter.daily.loading = false;
  }

  private setDailyBasisInfo(): void {
    let filterCurrent = this.data['byHour'].data.filter(bH => bH._id.numHour === this.currentDate.getHours() && bH._id.numDay === this.currentDate.getDate());
    this.totalRequestForCurrentHour = filterCurrent.length && filterCurrent[0].count;
    filterCurrent = this.data['byDay'].data.filter(bD => bD._id.numDay === this.currentDate.getDate() && bD._id.numMonth === this.currentDate.getMonth() + 1);
    this.totalRequestForCurrentDay = filterCurrent.length && filterCurrent[0].count;
    filterCurrent = this.data['byMonth'].data.filter(bM => bM._id.numMonth === this.currentDate.getMonth() + 1);
    this.totalRequestForCurrentMonth = filterCurrent.length && filterCurrent[0].count;
  }
}
