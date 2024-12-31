import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-container',
  templateUrl: './cart-container.component.html',
  styleUrls: ['./cart-container.component.scss']
})
export class CartContainerComponent implements OnInit {
  cartItems:any
constructor(private cartService:CartService,public router:Router){}
  ngOnInit(): void {
    this.cartItems=this.cartService.getCart();
    
    console.log(this.cartItems);
    
  }
  handleUpdateCartList($event: {data: any, action: string}){
    const{data,action}=$event;
    if (action === 'remove') {
      this.cartItems = this.cartItems.filter(
        (item: { details: { bookId: any }; }) => item.details.bookId !== data.details.bookId
      );
    } else if (action === 'update') {
      const updatedCartItems = this.cartItems.map((item: any) => {
        if (item.details.bookId === data.details.bookId) {
          item.quantity = data.quantity;
        }
        return item;
      });
      this.cartItems = updatedCartItems;
    }

    console.log('Updated Cart in Component:', this.cartItems); 
    console.log('Cart in Service after Update:', this.cartService.getCart());   }
  }
  



