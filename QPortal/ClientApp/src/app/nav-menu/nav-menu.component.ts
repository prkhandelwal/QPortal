import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})

export class NavMenuComponent {
  constructor(private authService: AuthService) {
    authService.isUserLoggedIn.subscribe(value => {
      this.isAuthenticated = value
    });

    authService.isUserAdmin.subscribe(value => {
      
      this.isAdmin = value
    });
  }


  public isAuthenticated: boolean;
  public isAdmin: boolean;

  ngOnInit() {
    this.authService.isAuthenticated();
    this.authService.isAdmin();
  }

  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    console.log("Logging out...");
    localStorage.clear();
    this.authService.isAuthenticated();
    this.authService.isAdmin();
  }
}
