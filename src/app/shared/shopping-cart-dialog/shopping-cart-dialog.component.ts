import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../services/auth.service";
import * as console from "node:console";

@Component({
  selector: 'app-shopping-cart-dialog',
  templateUrl: './shopping-cart-dialog.component.html',
  styleUrl: './shopping-cart-dialog.component.scss'
})
export class ShoppingCartDialogComponent implements OnInit {
  shoppingCartBooks: any[] = [];
  dialogRef = inject(MatDialogRef<ShoppingCartDialogComponent>)
  authService = inject(AuthService)

  ngOnInit(): void {
    this.loadShoppingCartBooks();
  }

  loadShoppingCartBooks() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('clickCount_')) {
        const bookId = key.replace('clickCount_', '');
        this.authService.getBookById(bookId).subscribe((book) => {
          const clickCount = this.getClickCount(bookId);
          const index = this.shoppingCartBooks.findIndex(item => item.id === bookId);
          if (index !== -1) {
            if (clickCount < 1) {
              this.shoppingCartBooks.splice(index, 1)
              localStorage.removeItem(`clickCount_${bookId}`);
            } else {
              this.shoppingCartBooks[index].clickCount = clickCount;
            }

          } else {
            this.shoppingCartBooks.push({ id: bookId, title: book.title, clickCount: clickCount });
          }
        });
      }
    }
  }



  increaseCount(bookId: string) {
    const index = this.shoppingCartBooks.findIndex(book => book.id === bookId);
    if (index !== -1) {
      this.shoppingCartBooks[index].clickCount++;
      this.updateClickCount(bookId, this.shoppingCartBooks[index].clickCount);
    }
  }

  decreaseCount(bookId: string) {
    const index = this.shoppingCartBooks.findIndex(book => book.id === bookId);
    if (index !== -1 && this.shoppingCartBooks[index].clickCount > 0) {
      this.shoppingCartBooks[index].clickCount--;
      this.updateClickCount(bookId, this.shoppingCartBooks[index].clickCount);
    }
  }

  updateClickCount(bookId: string, clickCount: number) {
    localStorage.setItem(`clickCount_${bookId}`, clickCount.toString());
  }

  getClickCount(bookId: string): number {
    const clickCount = localStorage.getItem(`clickCount_${bookId}`);
    return clickCount ? parseInt(clickCount) : 0;
  }

  close() {
    this.dialogRef.close();
  }

}
