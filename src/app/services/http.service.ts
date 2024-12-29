import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http:HttpClient) { 
      
    }
    getApiCall(url: string,options:any = {}){
      return this.http.get(url,options);
    }
  }

