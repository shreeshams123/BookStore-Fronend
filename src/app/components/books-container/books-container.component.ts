import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BooksService } from 'src/app/services/books.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-books-container',
  templateUrl: './books-container.component.html',
  styleUrls: ['./books-container.component.scss']
})
export class BooksContainerComponent implements OnInit {
  books: any[] = [];
  totalItems: string = '';
  pageSize: number = 15;  
  currentPage: number = 1;  
  totalPages: number = 1;  
  searchQuery:string='';
  subscription!:Subscription;
  selectedSortOption:string='';
  constructor(private bookService: BooksService,private dataService:DataService) { }

  ngOnInit(): void {
    this.fetchBooks();
    this.subscription=this.dataService.currSearchQuery.subscribe({next:(res:any)=>this.searchQuery=res});
  }

  fetchBooks(): void {
    this.bookService.getBooksApiCall(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.books = res.data.items;
        console.log(res);
        this.totalItems = res.data.totalCount;
        this.totalPages = Math.ceil(Number(this.totalItems) / this.pageSize); 
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchBooks();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchBooks();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchBooks();
    }
  }
  sortBooks(): void {
    if (this.selectedSortOption === 'lowToHigh') {
      this.books.sort((a, b) => a.price - b.price);
    } else if (this.selectedSortOption === 'highToLow') {
      this.books.sort((a, b) => b.price - a.price);
    }
  }

 
}
