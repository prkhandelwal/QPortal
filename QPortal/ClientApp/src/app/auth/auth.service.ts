import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of, BehaviorSubject } from 'rxjs';
import decode from 'jwt-decode';
@Injectable()

export class AuthService {

  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isUserAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public jwtHelper: JwtHelperService) {}
  // ...
  public isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("trigerring");
      this.isUserLoggedIn.next(!this.jwtHelper.isTokenExpired(token))
      return of(!this.jwtHelper.isTokenExpired(token));
    }
    this.isUserLoggedIn.next(false);
    return of(false);
  }

  public isAdmin(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = decode(token);

      if (tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == "Admin") {
        this.isUserAdmin.next(true);
        return of(true);
      }
      this.isUserAdmin.next(false);
      return of(false);
    }
  }
}
