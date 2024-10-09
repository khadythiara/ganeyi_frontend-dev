import { Client } from "./Client";
import { Product } from "./Product";
import { ProductApi } from "./ProductApi";
import { RequestResult } from "./RequestResults";

export interface ProductApiRequest {
  id?: string,
  duration: number,
  status: string,
  requestDate: Date,
  requestResult: RequestResult,
  productApi: ProductApi,
  product: Product,
  client: Client
}