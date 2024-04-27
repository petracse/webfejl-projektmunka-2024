import {Component, EventEmitter, inject, Output} from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Output() onCloseSidenav: EventEmitter<boolean> = new EventEmitter();

  constructor(protected authService: AuthService) {}

  close() {
    this.onCloseSidenav.emit(true);
  }

  logout() {
    this.authService.logout();

  }
}
