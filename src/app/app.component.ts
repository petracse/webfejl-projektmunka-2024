import {Component, inject, OnInit} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {AuthService} from "./shared/services/auth.service";

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
        localStorage.setItem('user', JSON.stringify(user));
      }
      else {
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
