import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: any[] = []; 

  addOrder(items: any[]): void {
    this.orders.push(...items); 
    console.log('Order placed:', this.orders); 
  }

  getOrders(): any[] {
    return [...this.orders]; 
  }
}
