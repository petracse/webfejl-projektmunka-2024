import {Component, inject, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {ConfirmationDialogComponent} from "../../../shared/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {BookService} from "../../../shared/services/book.service";

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent implements OnInit{
  maxTitleLength: number = 33
  @Input() book: any;
  isFavorite: boolean = false;
  bookService = inject(BookService)
  loginDialogOpen: boolean = false;
  dialog = inject(MatDialog)
  router = inject(Router);

  addToCart() {
    let clickCount = localStorage.getItem(`clickCount_${this.book.id}`);
    if (clickCount && parseInt(clickCount) > 0) {
      clickCount = String(parseInt(clickCount) + 1);
    } else {
      clickCount = '1';
    }
    localStorage.setItem(`clickCount_${this.book.id}`, clickCount);
  }


  toggleFavourite() {
    if (this.bookService.firebaseAuth.currentUser === null) {
      this.showLoginOrSignup()
    } else {
      this.bookService.toggleFavorite(this.book.id, this.bookService.firebaseAuth.currentUser!.uid).subscribe(() => {
        this.isFavorite = !this.isFavorite;
      });
    }
  }

  checkIfFavorite() {
    if (this.bookService.firebaseAuth.currentUser === null) {
      this.isFavorite = false;
    } else {
      this.bookService.isFavorite(this.book.id, this.bookService.firebaseAuth.currentUser!.uid).subscribe(isFav => {
        this.isFavorite = isFav;
      });
    }
  }

  ngOnInit(): void {
    this.checkIfFavorite();
  }

  showLoginOrSignup() {
    this.loginDialogOpen = true;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        question: 'You need to either login or signup for the feature.',
        positiveAnswer: 'To Login',
        negativeAnswer: 'Stay'
      }
    });

    const subs= dialogRef.afterClosed().subscribe({
      next: (result: boolean) => {
        this.loginDialogOpen = false;

        if (result) {
          this.router.navigate(['/login']);
        }
      },
      error: (error: any) => {
        console.error('Confirmation dialog error:', error);
      }
    });
  }

}
