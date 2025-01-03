import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerDetailsService } from 'src/app/services/customer-details.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
addresses:any
isAddingAddress:Boolean=false;
subscription!:Subscription
username:any='';
phone:any='';
email:any='';
newAddress = {
  type: '',
  address: '',
  city: '',
  state: '',
};
constructor(private customerService:CustomerDetailsService,private userService:UserService){
}
  ngOnInit(): void {
    this.addresses=this.customerService.getAddresses();
    this.subscription = this.userService.currUserDetails.subscribe((user) => {
      if (user && user.token) {
        this.username=user.name;
        this.phone=user.phone;
        this.email=user.email;
      } 
    });

  }
toggleAddAddress() {
  this.isAddingAddress = !this.isAddingAddress;
}

addAddress() {
  if (
    this.newAddress.type &&
    this.newAddress.address &&
    this.newAddress.city &&
    this.newAddress.state
  ) {
    this.customerService.addAddress({ ...this.newAddress });
    this.addresses = this.customerService.getAddresses();
    this.newAddress = { type: '', address: '', city: '', state: '' };
    this.isAddingAddress = false;
  } else {
    alert('Please fill out all fields.');
  }
  console.log(this.customerService.getAddresses());
}
}
