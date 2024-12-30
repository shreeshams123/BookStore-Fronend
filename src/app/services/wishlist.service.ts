import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist: any[] = []; 

  constructor() { }

  addToWishlist(book: any) {
    const existingBook = this.wishlist.find(item => item.id === book.id);
    
    if (!existingBook) {
      this.wishlist.push(book);
    }
  }

  removeFromWishList(bookId: number) {
    this.wishlist = this.wishlist.filter(item => item.id !== bookId);
  }

  isBookPresent(book:any){
    const existingBook = this.wishlist.find(item => item.id === book.id);
    if(existingBook){
      return true;
    }
    else{
      return false;
    }
  }
 
}
