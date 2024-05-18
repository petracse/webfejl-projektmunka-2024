import {Component, inject, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent implements OnInit{
  maxTitleLength: number = 33
  @Input() book: any;
  isFavorite: boolean = false;
  authService = inject(AuthService)

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
    this.authService.toggleFavourite(this.book.id).subscribe(() => {
      this.isFavorite = !this.isFavorite;
    });

  }

  checkIfFavorite() {
    this.authService.isFavorite(this.book.id).subscribe(isFav => {
      this.isFavorite = isFav;
    });
  }

  ngOnInit(): void {
    this.checkIfFavorite();
  }
}
