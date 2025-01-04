import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderList: any[] = [];
  constructor(private httpService:HttpService){}

  addOrder(order: any) {
    this.orderList.push(order);
  }

  getOrders() {
    return this.orderList;
  }

    getAuthorization() {
          const userDetails = localStorage.getItem('userDetails'); 
          if (userDetails) {
            const parsedUser = JSON.parse(userDetails);
            const token = parsedUser.token; 
            const headers = new HttpHeaders({
              'Authorization': `Bearer ${token}`
            });
            return headers;
          } else{
            return new HttpHeaders();
          }
     }
addOrderApiCall(data:any){
return this.httpService.postApiCall("https://localhost:7128/api/order",data,{ headers: this.getAuthorization() })
}
getOrderApiCall(){
  return this.httpService.getApiCall("https://localhost:7128/api/order",{headers:this.getAuthorization()})
}

}
