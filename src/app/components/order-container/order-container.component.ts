import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-container',
  templateUrl: './order-container.component.html',
  styleUrls: ['./order-container.component.scss']
})
export class OrderContainerComponent implements OnInit{
  orderItems:any;
  constructor(private orderService:OrderService,public router:Router){}
  ngOnInit(): void {
    this.orderItems=this.orderService.getOrders();
    console.log(this.orderItems);
    
  }

}
