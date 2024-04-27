import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {AuthService} from "./auth.service";
import {signOut, user} from "@angular/fire/auth";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  authService = inject(AuthService);

  title = 'web-dev-fw-project';

  ngOnInit() {
    this.authService.user$.subscribe(user => {
        if (user) {
          this.authService.currentUserSig.set({
            email: user.email!,
            username: user.displayName!
          });
        }
        else {
          this.authService.currentUserSig.set(null);
        }
        console.log(this.authService.currentUserSig())
      }
    )



  }

  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();

  }

  onClose($event: any, sidenav: MatSidenav) {
    if ($event === true) {
      sidenav.close();
      console.log(("igaz"));
    }

  }

  logout() {
    this.authService.logout();

  }
}
