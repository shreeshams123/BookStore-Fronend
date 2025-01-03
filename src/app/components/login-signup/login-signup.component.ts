import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/helper/must-match.validator';
import { CartService } from 'src/app/services/cart.service';
import { User, UserService } from 'src/app/services/user.service';

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
    constructor(private formBuilder: FormBuilder,private userService:UserService,private router:Router,private cartService:CartService) {}
  
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

    onLoginSubmit(): void {
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
    
          this.cartService.getCartApiCall().subscribe({
            next: (serverCartResponse: any) => {
              console.log(serverCartResponse);
              
              const serverCart = serverCartResponse.data.cartItems.map((item: any) => ({
                details: {
                  bookId: item.bookId,
                  bookName: item.bookName,
                  description: item.description,
                  image: item.image,
                  author: item.author,
                  price: item.price,
                },
                quantity: item.quantity,
              }));
    
              const localCart = this.cartService.getCart();
    
              this.synchronizeCart(localCart, serverCart);
    
              this.router.navigate(['/books-container']);
            },
            error: (err) => {
              console.log(err);
            },
          });
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

  
    }
    
  
    
      
    
  
  
    

