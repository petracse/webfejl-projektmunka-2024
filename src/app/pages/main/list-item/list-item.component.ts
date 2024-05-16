import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent {
  maxTitleLength: number = 33
  @Input() book: any;
  addToCart() {
    let clickCount = localStorage.getItem(`clickCount_${this.book.id}`);
    if (clickCount && parseInt(clickCount) > 0) {
      clickCount = String(parseInt(clickCount) + 1);
    } else {
      clickCount = '1';
    }
    localStorage.setItem(`clickCount_${this.book.id}`, clickCount);
  }


  addToFavourite() {

  }
}
