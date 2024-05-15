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

  }

  addToFavourite() {

  }
}
