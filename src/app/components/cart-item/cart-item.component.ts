import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import{DELETE_FOREVER_ICON} from 'src/assets/svg-icons';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent {
  @Input() item: any; 
  @Input() isWishlist:any;
  @Input() isOrder:any;
  @Output() updateList=new EventEmitter();

  constructor(private iconRegistry: MatIconRegistry,private sanitizer: DomSanitizer,private cartService: CartService,private wishlistService:WishlistService) {
    iconRegistry.addSvgIconLiteral('delete-forever-icon', sanitizer.bypassSecurityTrustHtml(DELETE_FOREVER_ICON));

  }

  updateQuantity(change: number) {
    const newQuantity = this.item.quantity + change;
    if (newQuantity <= 0) {
      this.removeItem();
    } else {
      this.cartService.addToCart(this.item.details, change);
      this.updateList.emit({ data: this.item, action: 'update' });
    }
  }

  removeItem() {
    this.cartService.addToCart(this.item.details, -this.item.quantity);
    alert(`${this.item.details.title} removed from cart`);
    this.updateList.emit({data:this.item,action:'remove'});
  }

  handleDeleteFromWishlist(){
    console.log(this.item.bookId);
    this.wishlistService.removeFromWishlist(this.item.bookId);
    this.updateList.emit({data:this.item,action:'remove'});
  }

 
}
