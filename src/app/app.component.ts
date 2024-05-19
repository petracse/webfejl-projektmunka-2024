import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {AuthService} from "./shared/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ShoppingCartDialogComponent} from "./shared/shopping-cart-dialog/shopping-cart-dialog.component";
import {Subscription} from "rxjs";
import {MenuComponent} from "./shared/menu/menu.component";
import {BookService} from "./shared/services/book.service";



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
  bookService = inject(BookService);

  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();

  }



  ngOnInit(): void {
     // csak akkor kell, ha újra importáljuk
    /*import('../assets/updated_books.json').then((booksData: any) => {
      this.firestoreService.uploadBooks(booksData.default);
    });*/


    //this.authService.ensureLowerCaseFieldsInBooksCollection().subscribe(() => {});
    this.subscription = this.bookService.clickCountChange.subscribe((bookId: string | void) => {
      if (bookId && MenuComponent.isCartDialogBlocked) {
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
    MenuComponent.isCartDialogBlocked = true;
    if (this.cartDialogRef) {
      this.cartDialogRef.close();
    }
    this.cartDialogRef = this.dialog.open(ShoppingCartDialogComponent, {
      width: '500px'
    });
  }

  handleBookClickCountZero(): void {
    if (MenuComponent.isCartDialogBlocked) {
      this.cartDialogRef.close();
      this.cartDialogRef = this.dialog.open(ShoppingCartDialogComponent, {
        width: '500px'
      });
    }

  }

}
