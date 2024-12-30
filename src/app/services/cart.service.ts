import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = []; 

  constructor() { }

  addToCart(book: any) {
    const existingBookIndex = this.cart.findIndex(item => item.id === book.id);
    if (existingBookIndex !== -1) {
      this.cart[existingBookIndex].quantity += book.quantity;
    } else {
      this.cart.push({ ...book, quantity: book.quantity });
    }
  }

  removeFromCart(bookId: number) {
    const index = this.cart.findIndex(item => item.id === bookId);
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
  }

  getBookQuantity(bookId: number): number {
    const book = this.cart.find(item => item.id === bookId);
    return book ? book.quantity : 0;
  }

  getBookDetails(bookId: number): any {
    return this.cart.find(item => item.id === bookId);
  }

  getCart() {
    return this.cart;
  }
}
