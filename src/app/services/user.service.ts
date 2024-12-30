import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService) { }

  loginApiCall(data: any) {
    return this.httpService.postApiCall("https://localhost:7128/api/user/login", data)
  } 

  registerApiCall(data:any){
    return this.httpService.postApiCall("https://localhost:7128/api/user/register",data)
  }
}
