import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CustomerDetailsService } from 'src/app/services/customer-details.service';
import { OrderService } from 'src/app/services/order.service';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cart-container',
  templateUrl: './cart-container.component.html',
  styleUrls: ['./cart-container.component.scss']
})
export class CartContainerComponent implements OnInit {
  cartItems:any
  addresses:any
  isExpanded:Boolean=false;
  username:any=''
  phone:any=''
  user:User={}
  subscription!:Subscription
  isAddingAddress:Boolean=false;
  showOrderSummary:Boolean=false;
  totalPrice: number = 0;

  newAddress = {
    type: '',
    address: '',
    city: '',
    state: '',
  };
  selectedAddressId: string = '';
constructor(private cartService:CartService,public router:Router,private customerService:CustomerDetailsService,private orderService:OrderService,private userService:UserService){}
  ngOnInit(): void {
    this.cartItems=this.cartService.getCart();
    this.addresses=this.customerService.getAddresses();
    this.subscription = this.userService.currUserDetails.subscribe((user) => {
      if (user && user.token) {
        this.user=user;
        this.username=user.name;
        this.phone=user.phone;
      } 
    });
    console.log(this.cartItems);
    console.log(this.addresses);
    
  }
  toggleExpand(){

    if(this.user?.name){
    this.isExpanded=!this.isExpanded;
    }
    else{
      this.router.navigate(['login-prompt']);  
    }
  }
  handleUpdateCartList($event: {data: any, action: string}){
    const{data,action}=$event;
    if (action === 'remove') {
      console.log("Inside cart container",data.details.bookId);
      
      this.cartItems = this.cartItems.filter(
        (item: { details: { bookId: any }; }) => item.details.bookId !== data.details.bookId
      );
      console.log(this.cartItems);
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
    console.log('Cart in Service after Update:', this.cartService.getCart()); 
    }
    toggleAddAddress() {
      this.isAddingAddress = !this.isAddingAddress;
    }
  
    addAddress() {
      if (
        this.newAddress.type &&
        this.newAddress.address &&
        this.newAddress.city &&
        this.newAddress.state
      ) {
        const addressData = {
          addressType: this.newAddress.type,
          name: this.username,  
          phone: this.phone, 
          address: this.newAddress.address,
          city: this.newAddress.city,
          state: this.newAddress.state,
        };
        this.customerService.addCustomerApicall(addressData).subscribe({next:(res:any)=>{
          console.log(res);  
          this.customerService.addAddress(res.data);
          // this.addresses = this.customerService.getAddresses();
        },
      error:(err)=>{
        console.log(err); 
      }})
        this.newAddress = { type: '', address: '', city: '', state: '' };
        this.isAddingAddress = false;
      } else {
        alert('Please fill out all fields.');
      }
      console.log(this.customerService.getAddresses());
    }
    
    handleaddresslist(selectedAddressId: string) {
      this.selectedAddressId = selectedAddressId;  
      console.log('Selected Address ID:', this.selectedAddressId);
    }
    showOrderSummarySection() {
      console.log(this.selectedAddressId);
      
      if(this.selectedAddressId){
      this.showOrderSummary = true;
      }
      else{
        alert('Please select a address')
      }
      this.calculateTotalPrice();
    }
    checkOut(){
      if (this.cartItems.length > 0) {
        console.log("Cart items",this.cartItems);
        
        this.orderService.addOrder({
          items: this.cartItems,
          addressId: this.selectedAddressId,
          orderDate: new Date(),
        });
    //  this.orderService.addOrderApiCall({addressId:this.selectedAddressId}).subscribe({next:(res:any)=>{
    //   console.log(res);
    //  },
    // error:(err)=>{
    //   console.log(err);
      
    // }})
        this.cartItems = [];
        this.cartService.clearCart();
  
      this.router.navigate(["/orderSuccess"])
    
    }
  }
  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((sum: number, item: { details: { price: number; }; quantity: number; }) => {
      return sum + (item.details.price * item.quantity);
    }, 0);
  }
  


}
