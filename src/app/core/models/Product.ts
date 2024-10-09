import { ProductApi } from "./ProductApi";

export interface Product {
    id: string,
    logo: string,
    name: string,
    description: any,
    isActive: boolean,
    productApi: ProductApi[]
    productApis: ProductApi[]
}