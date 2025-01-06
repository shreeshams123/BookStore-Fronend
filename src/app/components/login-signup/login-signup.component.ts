import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/helper/must-match.validator';
import { CartService } from 'src/app/services/cart.service';
import { CustomerDetailsService } from 'src/app/services/customer-details.service';
import { OrderService } from 'src/app/services/order.service';
import { User, UserService } from 'src/app/services/user.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent implements OnInit {
    form: boolean = true;
  
    loginForm!: FormGroup;
    signupForm!: FormGroup;
    loginSubmitted: boolean = false
    loginErrorMessage:string=''
    signupSubmitted:boolean=false
    signupErrorMessage:string=''
    constructor(private formBuilder: FormBuilder,private userService:UserService,private router:Router,private cartService:CartService,private customerService:CustomerDetailsService,private wishlistService:WishlistService,private orderService:OrderService,@Optional() public dialogRef: MatDialogRef<LoginSignupComponent>) {}
  
    ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required,Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ) ]]
      });
  
      this.signupForm = this.formBuilder.group({
        name:['',Validators.required],
        phone:['',[Validators.required,Validators.pattern('^\\d{10}')]],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required,Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ) ]],
          confirmPassword: ['', [Validators.required]]
      },{
        validator: MustMatch('password', 'confirmPassword')
    });
    }
  
  
  
    navigateBtn(): void {
      this.form = !this.form; 
    }
    get loginControls() { return this.loginForm.controls }

    onLoginSubmit() {
      console.log('login click');
      const { status = "", value } = this.loginForm;
      const { email, password } = value;
    
      this.loginSubmitted = true;
      if (status == "INVALID") return;
    
      this.userService.loginApiCall({ email, password }).subscribe({
        next: (res: any) => {
          console.log(res);
          const { name, email, phone, token } = res.data;
          const user = { name, email, phone, token };
          localStorage.setItem("userDetails", JSON.stringify(user));
          const userDetails: User = JSON.parse(localStorage.getItem("userDetails") || 'null');
          this.userService.updateUserDetails(userDetails);

          this.customerService.getCustomerApiCall().subscribe({next:(res:any)=>{
            console.log("Address from backend",res);
            const customerAddress=res.data[0]?.data||[];
            customerAddress.forEach((address:any)=>{
              this.customerService.addAddress(address);
              })
              console.log("address in customer service",this.customerService.getAddresses());
              
            },
            error:(err)=>console.log(err)
          })
          this.cartService.getCartApiCall().subscribe({
            next: (serverCartResponse: any) => {
              console.log(serverCartResponse);
              const serverCart = serverCartResponse.data.cartItems.map((item: any) => ({
                details: {
                  bookId: item.bookId,
                  title: item.title,
                  description: item.description,
                  image: item.image,
                  author: item.author,
                  price: item.price,
                },
                quantity: item.quantity,
              }));
    
              const localCart = this.cartService.getCart();
    
              this.synchronizeCart(localCart, serverCart);
            },
            error: (err) => {
              console.log(err);
            },
          });
          this.wishlistService.getWishListApicall().subscribe({next:(serverWishListRes:any)=>
            {console.log("Wishlist response",serverWishListRes);
              const serverWishList=serverWishListRes.data.map((item:any)=>({
                bookId:item.bookId,
                title:item.title,
                description: item.description,
                image: item.image,
                author: item.author,
                price: item.price
              }));
              console.log("server wishlist",serverWishList);
              
              const localWishlist=this.wishlistService.getWishlist();
              console.log("localwishlist",localWishlist);
              this.synchronizeWishList(serverWishList,localWishlist);
            },
            error:(err)=>
            console.log(err)        
          });
          this.orderService.getOrderApiCall().subscribe({
            next: (res: any) => {
              console.log("Order response received:", res);
          
              const orders = Array.isArray(res?.data) ? res.data : [];
              console.log("Orders to process:", orders);
          
              orders.forEach((order: any) => {
                console.log("Processing order:", order);
          
                if (order.orderItems && Array.isArray(order.orderItems)) {
                  order.orderItems.forEach((item: any) => {
                    const orderItem = {
                      ...item,
                      date: order.date, 
                      orderId: order.id, 
                      status: order.status, 
                    };
                    console.log("Attempting to add item:", orderItem);
          
                    this.orderService.addOrder(orderItem);
                  });
                } else {
                  console.warn("orderItems not found or invalid for order:", order);
                }
              });
          
              console.log("Final order list in service:", this.orderService.getOrders());
            },
            error: (err) => {
              console.error("Error fetching orders:", err);
            },
          });
          
          this.dialogRef.close();
          this.router.navigate(['/books-container']);
        },
        error: (err) => {
          console.log(err);
          if (err.error?.message) {
            this.loginErrorMessage = err.error.message;
          } else {
            this.loginErrorMessage = "Unexpected error occurred";
          }
          setTimeout(() => {
            this.loginErrorMessage = "";
          }, 3000);
        },
      });
}
    get signupControls() {return this.signupForm.controls};
    onSignupSubmit(): void {
      console.log('signup click');
      const {status = "", value } = this.signupForm
    const{name,email,phone,password,confirmPassword}=value
    console.log(this.signupForm.controls);
    this.signupSubmitted = true
    if(status == "INVALID") 
      return
    console.log(this.signupForm);
    console.log(this.signupForm.controls);
    this.userService.registerApiCall({name,email,phone,password,confirmPassword}).subscribe({next:(res)=>
      {
        console.log(res)
      },
      error: (err) => {
        console.log(err);
        if(err.error?.message){
        this.signupErrorMessage=err.error.message
        }
        else{
          this.signupErrorMessage="Unexpected error occured";        
        }
        setTimeout(() => {
          this.signupErrorMessage = ""; 
      }, 3000);
      }
      })
      
      
    }
    synchronizeCart(localCart: any[], serverCart: any[]): void {
      if (localCart.length === 0 && serverCart.length === 0) {
          return;
      }
  
      if (localCart.length === 0 && serverCart.length > 0) {
          console.log("Frontend cart is empty. Adding all items from the backend to the frontend cart.");
          serverCart.forEach(item => {
              this.cartService.addToCart(item.details, item.quantity);
          });
          return;
      }
  
      if (serverCart.length === 0 && localCart.length > 0) {
          console.log("Backend cart is empty. Adding all items from the frontend to the backend cart.");
          localCart.forEach(item => {
              const addRequestDto = { bookId: item.details.bookId, quantity: item.quantity };
              this.cartService.addToCartApiCall(addRequestDto).subscribe({
                  next: response => console.log('Item added to backend:', response),
                  error: error => console.error('Error adding item to backend cart:', error),
              });
          });
          return;
      }
      serverCart.forEach(serverItem => {
        const localItem = localCart.find(item => item.details.bookId === serverItem.details.bookId);
    
        if (localItem) {
          if (localItem.quantity !== serverItem.quantity) {
            console.log("removed from local cart",localItem.details.title);
            
            this.cartService.removeFromCart(localItem.details.bookId);
            this.cartService.addToCart(serverItem.details, serverItem.quantity);
          }
        } else {
          this.cartService.addToCart(serverItem.details, serverItem.quantity);
        }
      });
    
      localCart.forEach(localItem => {
        const serverItem = serverCart.find(item => item.details.bookId === localItem.details.bookId);
        
        if (!serverItem) {
          console.log(serverItem);
          
          const addRequestDto = {
            bookId: localItem.details.bookId,
            quantity: localItem.quantity
          };
    
          this.cartService.addToCartApiCall(addRequestDto).subscribe({
            next: (response) => {
              console.log('Local item added to backend cart:', response);
            },
            error: (error) => {
              console.error('Error adding local item to backend cart:', error);
            }
          });
        }
      });
    
      console.log('Frontend Cart after sync:', this.cartService.getCart());
    }

    synchronizeWishList(serverWishList:any[],localWishlist:any[]){
      if(localWishlist.length==0 && serverWishList.length===0){
        return;
      }
      if(localWishlist.length>0 && serverWishList.length===0){
        console.log(serverWishList.length);
        console.log("backend wishlist is empty adding items from local to server");
        localWishlist.forEach((item)=>{
          console.log(item.bookId);
          const addRequesetDto={
            bookId:item.bookId
          }
          this.wishlistService.addToWishListApicall(addRequesetDto).subscribe({next:(res:any)=>{
            console.log(res);
            
          },
        error:(err)=>{
          console.log(err);  
        }})
        })
      }
      if(serverWishList.length>0 && localWishlist.length===0){
        console.log("local wishlist is empty");
        serverWishList.forEach((item)=>{
          this.wishlistService.addToWishlist(item);
          console.log(this.wishlistService.getWishlist());
        });
      }
      if (serverWishList.length > 0 && localWishlist.length === 0) {
        console.log("Local wishlist is empty.");
        serverWishList.forEach((item) => {
          this.wishlistService.addToWishlist(item);
          console.log(this.wishlistService.getWishlist());
        });
      }
    
      if (serverWishList.length > 0 && localWishlist.length > 0) {
        console.log("Both server and local wishlists have items. Synchronizing...");
    
        const booksToAddToServer = localWishlist.filter(
          (localItem) => !serverWishList.some((serverItem) => serverItem.bookId === localItem.bookId)
        );
    
        const booksToAddToLocal = serverWishList.filter(
          (serverItem) => !localWishlist.some((localItem) => localItem.bookId === serverItem.bookId)
        );
    
        booksToAddToServer.forEach((item) => {
          const addRequestDto = { bookId: item.bookId };
          this.wishlistService.addToWishListApicall(addRequestDto).subscribe({
            next: (res: any) => {
              console.log(`Added to server: ${item.bookId}`);
            },
            error: (err) => {
              console.log(err);
            },
          });
        });
    
        booksToAddToLocal.forEach((item) => {
          this.wishlistService.addToWishlist(item);
          console.log(`Added to local: ${item.bookId}`);
        });
    
        console.log("Synchronization complete.");


    }
    }
    
  
  }
      
    
  
  
    

