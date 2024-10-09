import { ProductApiRequest } from "./ProductApiRequest";

export interface RequestResult {
    id?: string,
    value: string,
    jsonValue: any,
    valueContentType: string,
    fileUri?: any,
    productApiRequest: ProductApiRequest
}