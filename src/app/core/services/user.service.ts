import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../models/Client';
import { KeycloakTokens, KeycloakUser } from '../models/KeycloakUser';
import { RegistrationDTO } from '../models/RegistrationDTO';
import { JwtHelpersService } from './jwt-helper.service';
import { User } from '../models/User';
import { NewPassword } from '../models/NewPassword';
import { AccountType } from '../utils/types';
import { Utils } from '../utils/Utils';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient, private jwtService: JwtHelpersService, private utils: Utils) { }

  addCustomer = (payload: any) => {
    return this.http.post(`${environment.apiUrl}/clients`, payload, { observe: "response" });
  }

  getUserAccount(): Observable<User> {
    const user: KeycloakUser = JSON.parse(this.jwtService.GetTokenDecoded());
    return this.http.get<User>(`${environment.apiUrl}/users/account?username=${user.preferred_username}`);
  }

  getCustomerFromUserAccount(): Observable<Client> {
    const user: KeycloakUser = JSON.parse(this.jwtService.GetTokenDecoded());
    return this.http.get<Client>(`${environment.apiUrl}/clients/account/${user.sub}`);
  }

  resetForgottentPassword = (payload: any) => {
    return this.http.post(`${environment.apiUrl}/reset-password`, payload, { observe: "response" });
  }

  changePersonalInfo = (payload: any, id: string) => {
    return this.http.patch(`${environment.apiUrl}/clients/${id}`, payload, { observe: "response" });
  }

  changePassword = (payload: NewPassword) => {
    return this.http.post(`${environment.apiUrl}/change-password`, payload, { observe: "response" });
  }

  forgotPassword = (email: String) => {
    return this.http.post(`${environment.apiUrl}/mail/reset-password`, { email }, { observe: "response" });
  }

  activateAccount = (activationCode: string, accountType: AccountType) => {
    return this.http.patch<boolean>(`${environment.apiUrl}/account-activation/${activationCode}?accountType=${accountType}`, {});
  }

  getClientAgents = (id: string) => {
    return this.http.get(`${environment.apiUrl}/clients/${id}/agents/`);
  }

  createAgent = (payload: any) => {
    return this.http.post(`${environment.apiUrl}/agents`, payload, { observe: "response" });
  }

  deleteAgent = (id: string) => {
    return this.http.delete(`${environment.apiUrl}/agents/${id}`, { observe: "response" });
  }

  updateAgent = (payload: any, id: string) => {
    return this.http.put(`${environment.apiUrl}/agents/${id}`, payload, { observe: "response" });
  }

  updateAgentStatus = (payload: any, id: string) => {
    return this.http.put(`${environment.apiUrl}/agents/${id}`, payload, { observe: "response" });
  }

  getAgentAccount(): Observable<any> {
    const user: KeycloakUser = JSON.parse(this.jwtService.GetTokenDecoded());
    return this.http.get(`${environment.apiUrl}/agents/account/${user.sub}`);
  }

  getCustomerFromAgentAccount(id: string): Observable<Client> {
    return this.http.get<Client>(`${environment.apiUrl}/clients/account/${id}`);
  }

  resetCodeValidation(code: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/password/reset-code/${code}`);
  }
  
  agentFirstLogin = (payload: any) => {
    return this.http.post(`${environment.apiUrl}/agents/activation`, payload, { observe: "response" });
  }
}