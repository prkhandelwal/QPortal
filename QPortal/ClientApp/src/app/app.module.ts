import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JwtModule, JwtHelperService } from "@auth0/angular-jwt";

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { LoginPageComponent } from './login-page/login-page.component'
import { AddUsersComponent } from './add-users/add-users.component';

import { AuthGuardService } from './auth/auth-guard.service'
import { AuthService } from './auth/auth.service';
import { RoleGuardService } from './auth/role-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FetchDataComponent,
    LoginPageComponent,
    AddUsersComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    CommonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        }
      }
    }),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthGuardService] },
      { path: 'login-page', component: LoginPageComponent },
      { path: 'add-users', component: AddUsersComponent, canActivate: [RoleGuardService], data: { expectedRole: 'Admin' } }
    ])
  ],
  providers: [AuthService, JwtHelperService, RoleGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
