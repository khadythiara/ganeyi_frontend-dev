// role.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Utils } from '../utils/Utils';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private authenticationService: AuthenticationService, private router: Router, private utils: Utils) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | UrlTree {

        if (!this.authenticationService.currentUserValue) {
            this.router.navigate(['/auth/signin'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        if (this.utils.isAgent()) {
            this.router.navigate(['/dashboard/home'], { queryParams: { returnUrl: state.url } });
        }
        return true;
    }
}
