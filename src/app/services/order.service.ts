import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderList: any[] = [];

  addOrder(order: any) {
    this.orderList.push(order);
  }

  getOrders() {
    return this.orderList;
  }
}
