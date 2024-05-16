import {Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{
  authService = inject(AuthService);
  router = inject(Router);
  books: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  ngOnInit(): void {
    this.loadBooks(this.currentPage);
    this.calculateColumns();
  }

  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    this.calculateColumns();
  }

  updateUrl() {
    this.router.navigate([], {
      queryParams: {page: this.currentPage},
      queryParamsHandling: 'merge'
    });
  }

  loadBooks(page: number) {
    const startAt = (page - 1);

    this.authService.getBooks(startAt).subscribe((data: any) => {
      this.books = data.books;
      this.currentPage = page;
      this.totalPages = data.totalPages; // Set totalPages here
    });
  }


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBooks(this.currentPage);
      //this.updateUrl();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBooks(this.currentPage);
      //this.updateUrl();
    }
  }

  calculateColumns(): void {
    const screenWidth = window.innerWidth;
    const itemWidth = 200; // Ez a <app-list-item> fix szélessége
    let maxColumns = Math.floor(screenWidth / itemWidth);
    while (20 % maxColumns !== 0) {
      maxColumns--;
    }
    //maxColumns = Math.min(maxColumns,5);
    //maxColumns--;
    document.documentElement.style.setProperty('--max-columns', maxColumns.toString());
  }

  getMaxColumns(): number {
    const maxColumnsStr = getComputedStyle(document.documentElement).getPropertyValue('--max-columns');
    const maxColumns = parseInt(maxColumnsStr.trim(), 10);
    return isNaN(maxColumns) ? 4 : maxColumns;
  }

}
