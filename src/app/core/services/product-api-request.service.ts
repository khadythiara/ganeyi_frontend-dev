import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FilterType } from '../utils/types';

@Injectable({
  providedIn: 'root'
})
export class ProductApiRequestService {

  constructor(private httpClient: HttpClient) { }

  getClientKpiData(clientId: String, filterType?: FilterType, beginAt?: String, productId?: string, status?: string) {
    let queryParams = `${filterType ? '?filterType='+filterType+'&beginAt='+beginAt : ''}`;
    queryParams += `${productId ? filterType ? '&productId='+productId : '?productId='+productId : ''}`;
    queryParams += `${status ? (productId || filterType) ? '&status='+status : '?status='+status : ''}`;
    return this.httpClient.get<any>(`${environment.apiUrl}/product-api-requests/client/${clientId}/kpi${queryParams}`);
  }
}
