import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy{
  authService = inject(AuthService);
  booksSubscription: Subscription = new Subscription();
  books: any[] = [];

  ngOnInit(): void {
    this.booksSubscription = this.authService.loadBooks().subscribe(books => {
      this.books = books;
    });
  }

  ngOnDestroy(): void {
    // Leiratkozás, hogy elkerüljük a memóriafuvarozást
    this.booksSubscription.unsubscribe();
  }





}
