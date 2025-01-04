import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CartService } from 'src/app/services/cart.service';
import { User, UserService } from 'src/app/services/user.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import{DELETE_FOREVER_ICON} from 'src/assets/svg-icons';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {
  @Input() item: any; 
  @Input() isWishlist:any;
  @Input() isOrder:any;
  @Output() updateList=new EventEmitter();
  user:User={}
  constructor(private iconRegistry: MatIconRegistry,private sanitizer: DomSanitizer,private cartService: CartService,private wishlistService:WishlistService,private userService:UserService) {
    iconRegistry.addSvgIconLiteral('delete-forever-icon', sanitizer.bypassSecurityTrustHtml(DELETE_FOREVER_ICON));

  }
  ngOnInit(): void {
    this.userService.currUserDetails.subscribe((user:any)=>{
      this.user=user
    })
  }

  updateQuantity(change: number) {
    const newQuantity = this.item.quantity + change;
    if (newQuantity <= 0) {
      console.log('New Quantity:', newQuantity);
      this.cartService.removeFromCart(this.item.details.bookId);
      if(this.user?.name){
        console.log(this.item.details.bookId);
        this.cartService.deleteFromCartApiCall(this.item.details.bookId).subscribe({next:(res)=>{
          console.log(res);
          
        },error:(err)=>{
          console.log(err);
        }
      });
      }
      this.updateList.emit({data:this.item,action:'remove'});
}
 else {
      this.cartService.addToCart(this.item.details, change);
      if(this.user?.name){
        const addRequestDto={
          bookId:this.item.details.bookId,
          quantity:newQuantity
        }
        this.cartService.updateCartApiCall(addRequestDto).subscribe({next:(res)=>{
          console.log(res);
        },
      error:(err)=>console.log(err)
      })
      }
      this.updateList.emit({ data: this.item, action: 'update' });
    }
  }

  removeItem() {
    this.cartService.removeFromCart(this.item.details.bookId);
    alert(`${this.item.details.title} removed from cart`);
    if(this.user?.name){
      console.log(this.item.details.bookId);
      this.cartService.deleteFromCartApiCall(this.item.details.bookId).subscribe({next:(res)=>{
        console.log(res);
        
      },error:(err)=>{
        console.log(err);
      }
    });
    }
    this.updateList.emit({data:this.item,action:'remove'});
  }

  handleDeleteFromWishlist(){
    console.log(this.item.bookId);
    this.wishlistService.removeFromWishlist(this.item.bookId);
    if(this.user?.name){
      this.wishlistService.deleteFromWishListApicall(this.item.bookId).subscribe({next:(res:any)=>{
        console.log(res);
        },
      error:(err)=>{
        console.log(err); 
      }})
    }
    this.updateList.emit({data:this.item,action:'remove'});
  }

 
}
