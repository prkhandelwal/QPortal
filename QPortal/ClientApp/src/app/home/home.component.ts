import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import decode from 'jwt-decode';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private authService: AuthService) {
    authService.isUserLoggedIn.subscribe(value => {
      this.isAuthenticated = value;
    });

    authService.isUserAdmin.subscribe(value => {
      this.isAdmin = value;
    })
  }

  public userName: string;
  public name: string;
  public address: string;
  public dob: string;
  public isAdmin: boolean;

  public isAuthenticated: boolean;

  ngOnInit() {
    const token = localStorage.getItem('token');
    console.log(token);

    if (token) {
      const tokenPayload = decode(token);

      this.name = tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      this.userName = tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      this.address = tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/streetaddress'];
      this.dob = tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth'];
    }
  }
}
