import { Product } from "./Product";

export interface Client {
  id: string;

  accountId: string;

  companyName: string;

  firstName: string;

  lastName: string;

  address: string;

  phoneNumber: string;

  email: string;

  website: string;

  secteur: string;

  country: string;

  city: string;

  isActive: boolean;

  products: Product[];
}