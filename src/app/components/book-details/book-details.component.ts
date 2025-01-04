import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit{
  bookId:number|null=null;
  bookDetails:any={};
  bookQuantity:number=0;
  isInWishlist:boolean=false;
  user:User={}
  constructor(private route:ActivatedRoute,private bookService:BooksService,public router:Router,private cartService:CartService,private wishlistService:WishlistService,private userService:UserService){

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.bookId = id ? +id : null;

      if (this.bookId !== null) {
        this.loadBookDetails(this.bookId);
      } else {
        console.error('Invalid book ID');
      }
    });
    this.userService.currUserDetails.subscribe((user:any)=>{
      this.user=user
    })

  }

  private loadBookDetails(bookId: number) {
    this.bookService.getBookById(bookId).subscribe({
      next: (res: any) => {
        this.bookDetails = res.data;
        this.bookQuantity = this.cartService.getBookQuantity(bookId); 
        this.isInWishlist=this.wishlistService.isInWishlist(bookId);
        console.log('Loaded Book Details:', this.bookDetails);
        console.log('Loaded Quantity for Current Book:', this.bookQuantity);
        console.log('is in wishlist',this.isInWishlist);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  addToCart() {
    this.cartService.addToCart(this.bookDetails, 1); 
    this.bookQuantity = this.cartService.getBookQuantity(this.bookDetails.bookId); 
    console.log('Added to Cart. Current Quantity:', this.bookQuantity);
    if(this.user?.name){
      const addRequestDto = {
        bookId: this.bookDetails.bookId,
        quantity: 1
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
}
  
  
  decreaseQuantity() {
    this.cartService.addToCart(this.bookDetails, -1); 
   this.bookQuantity = this.cartService.getBookQuantity(this.bookDetails.bookId); 
  console.log('Decreased Quantity. Current Quantity:', this.bookQuantity);
    if(this.user?.name){
      const addRequestDto = {
        bookId: this.bookDetails.bookId,
        quantity: this.bookQuantity
      };
  this.cartService.updateCartApiCall(addRequestDto).subscribe({next:(res)=>{
    console.log(res);
  },
error:(err)=>console.log(err)
})
    } 
  }
  
  increaseQuantity() {
    this.cartService.addToCart(this.bookDetails, 1); 
        this.bookQuantity = this.cartService.getBookQuantity(this.bookDetails.bookId); 
        console.log('Increased Quantity. Current Quantity:', this.bookQuantity);
          if(this.user?.name){
            const addRequestDto = {
              bookId: this.bookDetails.bookId,
              quantity: this.bookQuantity
            };
        this.cartService.updateCartApiCall(addRequestDto).subscribe({next:(res)=>{
          console.log(res);
        },
      error:(err)=>console.log(err)
      })
          }
        
  }
 toggleWishlist() {

        if (this.isInWishlist) {
          this.wishlistService.removeFromWishlist(this.bookDetails.bookId);
          if(this.user?.name){
            this.wishlistService.deleteFromWishListApicall(this.bookDetails.bookId).subscribe({next:(res:any)=>{
              console.log(res);
              
            },error:(err)=>{
              console.log(err);
              
            }})
          }
        } else {
          this.wishlistService.addToWishlist(this.bookDetails);
          if(this.user?.name){
            this.wishlistService.addToWishListApicall({bookId:this.bookDetails.bookId}).subscribe({next:(res:any)=>{
              console.log(res);  
            },error:(err)=>{
              console.log(err);
            }})
          }
        }
        this.isInWishlist = this.wishlistService.isInWishlist(this.bookDetails.bookId);
        console.log('isInWishlist after toggle:', this.isInWishlist);
   
  }
  
}
