import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {AuthService} from "./shared/services/auth.service";
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  authService = inject(AuthService);
  title = 'web-dev-fw-project';

  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();

  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email ?? '',
          username: user.displayName ?? '',
          name: {
            firstname: '',
            lastname: ''
          },
          address:
            {
              postalCode: '',
              city: '',
              addressLine: ''
            },
          phoneNumber: user.phoneNumber ?? '',
          registrationDate: new Date(),
          profilePictureUrl: '',
          is_admin: false
        });
        localStorage.setItem('user', JSON.stringify(user));
      }
      else {
        this.authService.currentUserSig.set(null);
        localStorage.setItem('user', JSON.stringify(null));
      }
    });
  }

  onClose($event: any, sidenav: MatSidenav) {
    if ($event === true) {
      sidenav.close();
    }

  }

  logout() {
    this.authService.logout();

  }
}
