import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log("in auth guard");
    var isAuth = this.auth.isAuthenticated()
    if (!isAuth) {
      this.router.navigate(['login-page']);
    }
    return isAuth;
  }
}
