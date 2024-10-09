import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { KeycloakTokens } from '../models/KeycloakUser';

@Injectable({
  providedIn: 'root'
})
export class JwtHelpersService {
  private payload: KeycloakTokens = JSON.parse(localStorage.getItem('currentUser')!);

  constructor(private jwtHelper: JwtHelperService) { }

  GetTokenDecoded() {
    return JSON.stringify(this.jwtHelper.decodeToken(this.payload.access_token));
  }

  getTokenExpirationDate() {
    return this.jwtHelper.getTokenExpirationDate(this.payload.access_token);
  }

  isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired(this.payload.access_token);
  }
}
