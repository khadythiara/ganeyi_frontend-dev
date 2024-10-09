import { Product } from "./Product";

export interface ProductApi {

  id: string;

  version: string;

  serviceURL: string;

  docURL: string;

  isActive: boolean;

  type: string;

  product: Product;

}