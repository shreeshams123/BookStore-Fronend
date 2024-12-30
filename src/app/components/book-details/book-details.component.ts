import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit{
  bookId:number|null=null;
  bookDetails:any={};
  bookQuantity:number=0;
  constructor(private route:ActivatedRoute,private bookService:BooksService,public router:Router,private cartService:CartService,private wishlistService:WishlistService){

  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookId = id ? +id : null;
    if (this.bookId !== null) {
      this.bookService.getBookById(this.bookId).subscribe({
        next: (res: any) => {
          this.bookDetails=res.data;
          this.bookQuantity = this.cartService.getBookQuantity(this.bookDetails.id);
          console.log(this.bookDetails);
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.error('Invalid book ID');
    }
      
  }
  toggleCart() {
    if (this.bookQuantity === 0) {
      // Add the whole book object with a quantity of 1
      this.cartService.addToCart({ ...this.bookDetails, quantity: 1 });
    } else {
      // Add the book to cart with an updated quantity
      this.cartService.addToCart({ ...this.bookDetails, quantity: 1 });
    }
    this.bookQuantity = this.cartService.getBookQuantity(this.bookDetails.id);
  }

  decreaseQuantity() {
    if (this.bookQuantity > 1) {
      this.cartService.addToCart({ ...this.bookDetails, quantity: -1 });
      this.bookQuantity = this.cartService.getBookQuantity(this.bookDetails.id);
      console.log(this.cartService.getBookQuantity(this.bookDetails.id));
    } else {
      this.cartService.removeFromCart(this.bookDetails.id);
      this.bookQuantity = 0;
      console.log(this.cartService.getBookQuantity(this.bookDetails.id));
    }
  }

  increaseQuantity() {
    this.cartService.addToCart({ ...this.bookDetails, quantity: 1 });
    this.bookQuantity = this.cartService.getBookQuantity(this.bookDetails.id);
    console.log(this.cartService.getBookQuantity(this.bookDetails.id));
  }

  // addToWishList(){
  //   this.wishlistService.addToWishlist()
  // }
 
}
