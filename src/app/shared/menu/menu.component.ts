import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {ShoppingCartDialogComponent} from "../shopping-cart-dialog/shopping-cart-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {BookService} from "../services/book.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, OnDestroy{
  @Output() onCloseSidenav: EventEmitter<boolean> = new EventEmitter();
  subscription!: Subscription;
  authService: AuthService = inject(AuthService);
  bookService = inject(BookService);
  dialog: MatDialog = inject(MatDialog);
  cartDialogRef: any;

  static isCartDialogBlocked: boolean = true;

  close() {
    this.onCloseSidenav.emit(true);
  }

  logout() {
    this.authService.logout();

  }

  showCartContent() {
    MenuComponent.isCartDialogBlocked = false;
    if (this.cartDialogRef) {
      this.cartDialogRef.close();
    }
    this.cartDialogRef = this.dialog.open(ShoppingCartDialogComponent, {
      width: '100%'
    });
  }

  ngOnInit(): void {
    this.subscription = this.bookService.clickCountChange.subscribe((bookId: string | void) => {
      if (bookId && !MenuComponent.isCartDialogBlocked) {
        this.handleBookClickCountZero();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleBookClickCountZero(): void {
    this.showCartContent();
  }
}
