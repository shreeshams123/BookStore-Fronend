import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {
@Input() bookDetails:any;
constructor(private router:Router){

}

openBookDetails(id:number){
  this.router.navigate(["/book-details",id])
}
 
}
