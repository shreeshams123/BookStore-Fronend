import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerDetailsService {
  private addresses: any[] = [];
  private currentId: number = 3; // Start from 3, but will increment on each addition

  addAddress(newAddress: { type: string; address: string; city: string; state: string }) {
    // Increment currentId before generating the new address ID
    const newId = (this.currentId++).toString();  // Increment the currentId first, then convert to string
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
}
