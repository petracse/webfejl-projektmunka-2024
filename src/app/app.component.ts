import {Component, EventEmitter, Output} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'web-dev-fw-project';

  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();

  }


  onClose($event: any, sidenav: MatSidenav) {
    if ($event === true) {
      sidenav.close();
      console.log(("igaz"));
    }

  }
}
