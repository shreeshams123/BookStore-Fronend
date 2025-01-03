import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: { [key: number]: { details: any; quantity: number } } = {}; 

  constructor(private httpService:HttpService) {}

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

  removeFromCart(bookId: number) {
    if (this.cart[bookId]) {
      delete this.cart[bookId];
      console.log(`Removed book with ID: ${bookId} from the cart`);
    } else {
      console.log(`Book with ID: ${bookId} not found in the cart`);
    }
  }
  
  
  getCart() {
    const cart = Object.values(this.cart);
    console.log('Cart Data:', cart);
    return cart;  
  }
    clearCart(){
      this.cart={};
    }

    getAuthorization() {
      const userDetails = localStorage.getItem('userDetails'); 
      if (userDetails) {
        const parsedUser = JSON.parse(userDetails);
        const token = parsedUser.token; 
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return headers;
      } else{
        return new HttpHeaders();
      }
    }
    addToCartApiCall(data:any){
      return this.httpService.postApiCall("https://localhost:7128/api/cart",data,{ headers: this.getAuthorization() });
    }
    getCartApiCall(){
      return this.httpService.getApiCall("https://localhost:7128/api/cart",{ headers: this.getAuthorization() });
    }
    updateCartApiCall(data:any){
      return this.httpService.patchApiCall("https://localhost:7128/api/cart/update",data,{ headers: this.getAuthorization() });
    }
    deleteFromCartApiCall(data:any){
      return this.httpService.deleteApiCall(`https://localhost:7128/api/cart/${data}`,{ headers: this.getAuthorization() });

    }
}
