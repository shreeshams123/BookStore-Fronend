import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomerDetailsService } from 'src/app/services/customer-details.service';

@Component({
  selector: 'app-address-item',
  templateUrl: './address-item.component.html',
  styleUrls: ['./address-item.component.scss']
})
export class AddressItemComponent {
  @Input() item: any;
  @Output() addressSelected = new EventEmitter<string>(); 
  isEditing = false; 
  editAddress: string = ''; 
  editCity: string = ''; 
  editState: string = ''; 
  selectedAddressId: string = ''; 
  constructor(private customerDetailsService:CustomerDetailsService){

  }

  ngOnInit() {
    this.editAddress = this.item.address;
    this.editCity = this.item.city;
    this.editState = this.item.state;
  }

  toggleEdit() {
    if (this.isEditing) {
      this.customerDetailsService.updateAddress(this.item.id, {
        address: this.editAddress,
        city: this.editCity,
        state: this.editState,
      });

      this.item.address = this.editAddress;
      this.item.city = this.editCity;
      this.item.state = this.editState;
    }

    this.isEditing = !this.isEditing; 
    console.log(this.customerDetailsService.getAddresses());
    
  }

  onAddressSelect() {
    console.log('Selected Address ID:', this.item.id);
    this.addressSelected.emit(this.item.id);  // Emit the selected address ID
  }
 
}
