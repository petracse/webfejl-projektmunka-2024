import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  authService = inject(AuthService);

}
