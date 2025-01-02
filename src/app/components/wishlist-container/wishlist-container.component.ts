import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-wishlist-container',
  templateUrl: './wishlist-container.component.html',
  styleUrls: ['./wishlist-container.component.scss']
})
export class WishlistContainerComponent implements OnInit {
  wishListItems:any;
  constructor(private wishlistService:WishlistService,public router:Router){}
  ngOnInit(): void {
    this.wishListItems=this.wishlistService.getWishlist();
    if (this.wishListItems.length === 0) {
      console.log('Your wishlist is empty'); 
      console.log(this.wishListItems);
      
    }
  }
  handleUpdateWishList($event:{data:any,action:string}){
      const{data,action}=$event;
      if(action=='remove'){
        this.wishListItems=this.wishListItems.filter((item: { bookId: any; })=>item.bookId!=data.bookId);
      }
      console.log(this.wishListItems);
      console.log(this.wishlistService.getWishlist());
      
  }

}