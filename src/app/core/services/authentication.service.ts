import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KeycloakTokens } from '../models/KeycloakUser';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<KeycloakTokens | null> | null;
  public currentUser: Observable<KeycloakTokens | null> | null;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = localStorage.getItem('currentUser') != null ?
      new BehaviorSubject<KeycloakTokens | null>(JSON.parse(localStorage.getItem('currentUser') ?? '')) :
      null;
    this.currentUser = this.currentUserSubject != null ? this.currentUserSubject.asObservable() : null;
  }

  public get currentUserValue(): KeycloakTokens | null | undefined {
    return this.currentUserSubject?.value;
  }

  login(login: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/signin`, { login, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject?.next(user);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject?.next(null);
    this.router.navigate(['/auth'])
  }

}
