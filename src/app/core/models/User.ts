export interface User {
  id: string;

  username: string;

  password: string;

  firstName: string;

  lastName: string;

  email: string;

  imageUrl: string;

  activated: boolean;

  langKey: string;

  createdBy: Date;

  createdDate: Date;

  lastModifiedBy: Date;

  lastModifiedDate: Date;

  authorities: string[];

  phoneNumber: string;

  roles: string[];
}