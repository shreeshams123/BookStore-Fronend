import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerDetailsService {
  private addresses: any[] = [];
  private currentId: number = 3; 
  constructor(private httpService:HttpService){

  }

  addAddress(newAddress: any) {
    
    this.addresses.push(newAddress);
  }

  getAddresses() {
    return this.addresses;
  }

  updateAddress(id: string, updatedDetails: { address: string; city: string; state: string }) {
    const addressIndex = this.addresses.findIndex(addr => addr.id === id);
    if (addressIndex !== -1) {
      this.addresses[addressIndex] = { ...this.addresses[addressIndex], ...updatedDetails };
    }
  }
clearAddress(){
  this.addresses=[];
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
  addCustomerApicall(data:any){
    return this.httpService.postApiCall(`https://localhost:7128/api/customerDetails`,data,{ headers: this.getAuthorization() })
  }
  getCustomerApiCall(){
    return this.httpService.getApiCall(`https://localhost:7128/api/customerDetails`,{ headers: this.getAuthorization() })
  }
  editCustomerApicall(data:any,addressId:any){
    return this.httpService.patchApiCall(`https://localhost:7128/api/customerDetails/${addressId}`,data,{ headers: this.getAuthorization() })
  }
  
}
