export interface RegistrationDTO {
  login: string;
  password: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  activated: boolean;
  roles: string[];
}