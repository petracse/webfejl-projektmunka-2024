import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {BookService} from "../services/book.service";

@Component({
  selector: 'app-shopping-cart-dialog',
  templateUrl: './shopping-cart-dialog.component.html',
  styleUrl: './shopping-cart-dialog.component.scss'
})
export class ShoppingCartDialogComponent implements OnInit, OnDestroy {

  shoppingCartBooks: any[] = [];
  dialogRef = inject(MatDialogRef<ShoppingCartDialogComponent>)
  bookService = inject(BookService)
  subscription: Subscription = new Subscription();
  totalPrice: number = 0;


  ngOnInit(): void {
    this.loadShoppingCartBooks();

    this.subscription.add(
      this.bookService.clickCountChange.subscribe(() => {
        this.loadShoppingCartBooks();

      })
    );
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
          this.bookService.getBookById(bookId).subscribe((book) => {
            const index = this.shoppingCartBooks.findIndex(item => item.id === bookId);
            if (index !== -1) {
              this.shoppingCartBooks[index].clickCount = clickCount;
            } else {
              this.shoppingCartBooks.push({ id: bookId, title: book.title, clickCount: clickCount });
              this.totalPrice += 10;
            }
          });
        }
      }
    }
  }

  calculateTotalPrice() {
    let totalPrice = 0;
    for (let book of this.shoppingCartBooks) {
      totalPrice += book.clickCount * 10;
      console.log(totalPrice)
    }
    this.totalPrice = totalPrice;
  }

  increaseCount(bookId: string) {
    const index = this.shoppingCartBooks.findIndex(book => book.id === bookId);
    if (index !== -1) {
      this.shoppingCartBooks[index].clickCount++;
      this.bookService.updateClickCount(bookId, this.shoppingCartBooks[index].clickCount); // Frissítjük a clickCount-ot
      this.totalPrice += 10;
    }
  }

  decreaseCount(bookId: string) {
    const index = this.shoppingCartBooks.findIndex(book => book.id === bookId);
    if (index !== -1 && this.shoppingCartBooks[index].clickCount > 0) {
      this.shoppingCartBooks[index].clickCount--;
      this.bookService.updateClickCount(bookId, this.shoppingCartBooks[index].clickCount); // Frissítjük a clickCount-ot
      this.totalPrice -= 10;
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
    this.subscription.unsubscribe()
  }

}
