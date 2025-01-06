import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CustomerDetailsService } from 'src/app/services/customer-details.service';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { LoginSignupComponent } from '../login-signup/login-signup.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  searchQuery:string='';
  isLoggedIn:boolean=false;
  username: any
  subscription!:Subscription
  constructor(private router:Router,private dataService:DataService,public userService:UserService,private cartService:CartService,private customerService:CustomerDetailsService,private wishlistService:WishlistService,private dialog: MatDialog){

  }
  ngOnInit(): void {
    this.router.navigate(['/books-container']); 
    this.subscription = this.userService.currUserDetails.subscribe((user) => {
      if (user && user.token) {
        this.username = user.name;
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }
  handleSearchQuery() {
    this.dataService.updateSearchQuery(this.searchQuery)
  }

  onClickCart(){
    this.router.navigate(["/cart"]);
  }
  
  navigateTo(path: string): void {
    this.router.navigate([path]);  
}
  
  logout(): void {
    localStorage.clear();
    this.userService.updateUserDetails(null); 
    this.cartService.clearCart();
    this.wishlistService.clearWishlist();
    this.customerService.clearAddress();
    this.username = null;
    this.isLoggedIn = false;
    this.router.navigate(["/books-container"]);  
  }

  openLogin(){
    let dialogRef=this.dialog.open(LoginSignupComponent)
  }
  
}
