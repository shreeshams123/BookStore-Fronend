import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

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
  constructor(private router:Router,private dataService:DataService,public userService:UserService,private cartService:CartService){

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
    this.userService.currUserDetails.subscribe(user => {
      if (user && user.token) {
        this.router.navigate([path]);  
      } else {
        this.router.navigate(['login-prompt']);  
      }
    });
  }
  
  logout(): void {
    localStorage.clear();
    this.userService.updateUserDetails(null); 
    this.cartService.clearCart();
    this.username = null;
    this.isLoggedIn = false;
    this.router.navigate(["/books-container"]);  
  }
  
}
