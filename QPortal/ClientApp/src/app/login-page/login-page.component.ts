import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router'
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private router: Router, auth: AuthService)
  {
    this._http = http;
    this._baseUrl = baseUrl;
    this._auth = auth;
  }
  private _auth: AuthService
  private _http: HttpClient;
  private _baseUrl: string;
  public loginDetails: LoginDetails = new LoginDetails();
  public errorMessage: string;

  onLogin() {
    console.log(this.loginDetails);

    this._http.post<Token>(this._baseUrl + "api/login", this.loginDetails).subscribe(result => {
      console.log(result);
      if (result.token) {
        localStorage.setItem('token', result.token);
        this._auth.isAuthenticated();
        this._auth.isAdmin();
        this.router.navigate(['/']);
      }
    }, error => {
        console.log(error);
        this.errorMessage = error.error;
    })
  }
}

interface Token {
  token: string;
}

class LoginDetails {
  userName: string;
  password: string;
}
