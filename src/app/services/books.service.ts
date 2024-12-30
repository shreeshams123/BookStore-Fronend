import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private httpService:HttpService) { }
  getBooksApiCall(pageNumber: number, pageSize: number): Observable<any> {
    const params = { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() };
    return this.httpService.getApiCall(`https://localhost:7128/api/getbook`, { params });
  }

  getBookById(bookId:number){
    return this.httpService.getApiCall(`https://localhost:7128/api/book/${bookId}`)
  }
}
