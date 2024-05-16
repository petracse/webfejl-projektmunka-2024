import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../services/auth.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-shopping-cart-dialog',
  templateUrl: './shopping-cart-dialog.component.html',
  styleUrl: './shopping-cart-dialog.component.scss'
})
export class ShoppingCartDialogComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  shoppingCartBooks: any[] = [];
  dialogRef = inject(MatDialogRef<ShoppingCartDialogComponent>)
  authService = inject(AuthService)

  ngOnInit(): void {
    this.loadShoppingCartBooks();
    this.authService.clickCountChange.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.loadShoppingCartBooks();
    });
  }

  loadShoppingCartBooks() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('clickCount_')) {
        const bookId = key.replace('clickCount_', '');

        const clickCount = this.getClickCount(bookId);
        if (clickCount <= 0) {
          localStorage.removeItem(`clickCount_${bookId}`);

          const index = this.shoppingCartBooks.findIndex(item => item.id === bookId);
          if (index !== -1) {
            this.shoppingCartBooks.splice(index, 1);
          }
        } else {
          this.authService.getBookById(bookId).subscribe((book) => {
            const index = this.shoppingCartBooks.findIndex(item => item.id === bookId);
            if (index !== -1) {
              this.shoppingCartBooks[index].clickCount = clickCount;
            } else {
              this.shoppingCartBooks.push({ id: bookId, title: book.title, clickCount: clickCount });
            }
          });
        }
      }
    }
  }


  increaseCount(bookId: string) {
    const index = this.shoppingCartBooks.findIndex(book => book.id === bookId);
    if (index !== -1) {
      this.shoppingCartBooks[index].clickCount++;
      this.authService.updateClickCount(bookId, this.shoppingCartBooks[index].clickCount); // Frissítjük a clickCount-ot
    }
  }

  decreaseCount(bookId: string) {
    const index = this.shoppingCartBooks.findIndex(book => book.id === bookId);
    if (index !== -1 && this.shoppingCartBooks[index].clickCount > 0) {
      this.shoppingCartBooks[index].clickCount--;
      this.authService.updateClickCount(bookId, this.shoppingCartBooks[index].clickCount); // Frissítjük a clickCount-ot
    }
  }

  getClickCount(bookId: string): number {
    const clickCount = localStorage.getItem(`clickCount_${bookId}`);
    return clickCount ? parseInt(clickCount) : 0;
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
