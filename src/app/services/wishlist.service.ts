import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist: any[] = [];  

  constructor() {}

  isInWishlist(bookId: number): boolean {
    return this.wishlist.some((book) => book.bookId === bookId); 
  }

  addToWishlist(bookDetails: any): void {
    if (!this.isInWishlist(bookDetails.bookId)) {
      this.wishlist.push(bookDetails);
    }
    console.log(this.wishlist);
  }

  removeFromWishlist(bookId: number): void {
    this.wishlist = this.wishlist.filter((book) => book.bookId !== bookId);
  }

  getWishlist(): any[] {
    return this.wishlist;
  }
 
}
