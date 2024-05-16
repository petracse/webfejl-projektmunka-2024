import {Component, inject, OnInit} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {AuthService} from "./shared/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ShoppingCartDialogComponent} from "./shared/shopping-cart-dialog/shopping-cart-dialog.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  authService = inject(AuthService);
  title = 'web-dev-fw-project';
  dialog: MatDialog = inject(MatDialog);

  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();

  }



  ngOnInit(): void {
     // csak akkor kell, ha újra importáljuk
    /*import('../assets/updated_books.json').then((booksData: any) => {
      this.firestoreService.uploadBooks(booksData.default);
    });*/

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

  showCartContent() {
    const dialogRef = this.dialog.open(ShoppingCartDialogComponent, {
      width: '500px'
    });
  }


}
