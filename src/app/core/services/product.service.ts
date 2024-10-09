import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Client } from '../models/Client';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAllProducts() {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`)
  }

  getAllCustomerProduct(id: string) {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/${id}/subscribe`)
  }

  subscription(user: Client, productId: string) {
    return this.http.post(`${environment.apiUrl}/clients/${user.id}/subscription/${productId}`, user, { observe: "response" })
  }

  sendRequest(files: File [], product: string, version: string, key: string) {
    let headers = new HttpHeaders();
    // headers = headers.append('Content-Type', 'multipart/form-data');
    // headers = headers.append('enctype', 'multipart/form-data');
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append("product", product);
    formData.append("version", version);
    formData.append("key", key);
    return this.http.post(`${environment.apiUrl}/product-api-requests/product`, formData)
  }

  getProductLicense(api: string, client: string) {
    return this.http.get(`${environment.apiUrl}/product-licenses/byclient/${client}`)
  }
}
