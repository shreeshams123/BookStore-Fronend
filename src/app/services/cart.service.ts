import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: { [key: number]: { details: any; quantity: number } } = {}; // Object to store book details and quantity

  constructor() {}

  addToCart(book: any, quantity: number) {
    const bookId = book.bookId;
  
    if (!bookId) {
      console.error('Book ID is undefined:', book);
      return;
    }
  
    if (this.cart[bookId]) {
      const newQuantity = this.cart[bookId].quantity + quantity;
      if (newQuantity > 0) {
        this.cart[bookId].quantity = newQuantity;
      } else {
        delete this.cart[bookId]; 
      }
    } else if (quantity > 0) {
      this.cart[bookId] = { details: book, quantity };
    }
    console.log('Updated Cart:', this.cart);
  }
  
  getBookQuantity(bookId: number): number {
    return this.cart[bookId] ? this.cart[bookId].quantity : 0;
  }
  
  getCart() {
    const cart = Object.values(this.cart);
    console.log('Cart Data:', cart);
    return cart;  }
}
