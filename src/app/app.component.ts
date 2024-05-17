import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {AuthService} from "./shared/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ShoppingCartDialogComponent} from "./shared/shopping-cart-dialog/shopping-cart-dialog.component";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  authService = inject(AuthService);
  title = 'web-dev-fw-project';
  dialog: MatDialog = inject(MatDialog);
  subscription!: Subscription;
  cartDialogRef: any;


  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();

  }



  ngOnInit(): void {
     // csak akkor kell, ha újra importáljuk
    /*import('../assets/updated_books.json').then((booksData: any) => {
      this.firestoreService.uploadBooks(booksData.default);
    });*/

    
    //this.authService.ensureLowerCaseFieldsInBooksCollection().subscribe(() => {});
    this.subscription = this.authService.clickCountChange.subscribe((bookId: string | void) => {
      if (bookId) {
        this.handleBookClickCountZero();
      }
    });

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout();

  }

  showCartContent() {
    if (this.cartDialogRef) {
      this.cartDialogRef.close();
    }
    this.cartDialogRef = this.dialog.open(ShoppingCartDialogComponent, {
      width: '500px'
    });
  }

  handleBookClickCountZero(): void {
    this.showCartContent();
  }


}
