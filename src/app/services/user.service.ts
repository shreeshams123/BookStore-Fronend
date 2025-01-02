import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BehaviorSubject } from 'rxjs';

export interface User {
  name: string | null;
  phone: string | null;
  email: string | null;
  token:string|null;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDetails = new BehaviorSubject<User | null>(null);
  currUserDetails = this.userDetails.asObservable();

  constructor(private httpService: HttpService) {}

  updateUserDetails(user: User | null) {
    this.userDetails.next(user);
  }
  

  loginApiCall(data: any) {
    return this.httpService.postApiCall("https://localhost:7128/api/user/login", data)
  } 

  registerApiCall(data:any){
    return this.httpService.postApiCall("https://localhost:7128/api/user/register",data)
  }
}
