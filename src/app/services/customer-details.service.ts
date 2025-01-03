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

  addAddress(newAddress: { type: string; address: string; city: string; state: string }) {
    const newId = (this.currentId++).toString();  
    const addressWithId = { id: newId, ...newAddress };
    this.addresses.push(addressWithId);
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
    this.httpService.postApiCall(`https://localhost:7128/api/customerDetails`,data,{ headers: this.getAuthorization() })
  }
  getCustomerApiCall(){
    this.httpService.getApiCall(`https://localhost:7128/api/customerDetails`,{ headers: this.getAuthorization() })
  }
  editCustomerApicall(data:any,addressId:any){
    this.httpService.patchApiCall(`https://localhost:7128/api/customerDetails/${addressId}`,data,{ headers: this.getAuthorization() })
  }

}
