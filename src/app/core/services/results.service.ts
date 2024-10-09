import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {ProductApiRequest} from '../models/ProductApiRequest';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private http: HttpClient) {
  }

  getRequests() {
    return this.http.get<ProductApiRequest[]>(`${environment.apiUrl}/product-api-requests`)
  }

  getRequestsByClient(clientId: string, page: number, size: number) {
    return this.http.get<ProductApiRequest[]>(
      `${environment.apiUrl}/product-api-requests/client/${clientId}?page=${page}&size=${size}`,
      {observe: 'response'})
  }

  getRequestsById(id: string | null) {
    return this.http.get<ProductApiRequest>(`${environment.apiUrl}/product-api-requests/${id}`)
  }

  getLicensesByClient(clientId: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/product-licenses/byclient/${clientId}`)
  }

}
