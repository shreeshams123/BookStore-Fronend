import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist: any[] = [];  

  constructor(private httpService:HttpService) {}

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
   addToWishListApicall(data:any){
    return this.httpService.postApiCall(`https://localhost:7128/api/wishlist`,data,{ headers: this.getAuthorization() });
   }
   getWishListApicall(){
    return this.httpService.getApiCall(`https://localhost:7128/api/wishlist`,{ headers: this.getAuthorization() });
  }
  deleteFromWishListApicall(data:any){
    return this.httpService.deleteApiCall(`https://localhost:7128/api/wishlist/${data}`,{ headers: this.getAuthorization() });

  }
  clearWishlist(){
    this.wishlist=[]
  }
}
