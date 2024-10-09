import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let errMsg = "Une erreur inattendue s'est produite sur notre serveur. Nous sommes désolés pour les inconvénients causés et faisons tout notre possible pour résoudre ce problème le plus rapidement possible. Veuillez réessayer ultérieurement."
    return next.handle(request).pipe(catchError(err => {
      switch (err.status) {
        case 401:
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          break;
        case 403:
          err.statusText === "OK" ? err.statusText = errMsg : ""
          break;
        case 500:
          err.error.message = errMsg
          break;

        default:
          break;
      }
      const error = (err.error.data && err.error.data.cause? err.error.data.cause : err.error.message) || err.error.details || err.details || err.statusText;
      return throwError(error);
    }))
  }
}