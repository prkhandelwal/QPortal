import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable()

export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = decode(token);
      console.log(tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
      if (!this.auth.isAuthenticated() || tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] !== expectedRole) {
        this.router.navigate(['login-page']);
        return false;
      }
      return true;
    }
    else {
      this.router.navigate(['login-page']);
      return false;
    }
    
  }
}
