import {Component, EventEmitter, inject, Output} from '@angular/core';
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Output() onCloseSidenav: EventEmitter<boolean> = new EventEmitter();

  authService = inject(AuthService);


  close() {
    this.onCloseSidenav.emit(true);
  }

  logout() {
    this.authService.logout();

  }
}
