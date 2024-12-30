import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private searchQuery = new BehaviorSubject("");
  currSearchQuery = this.searchQuery.asObservable();

  constructor() { }

  updateSearchQuery(query: string) {
    this.searchQuery.next(query)
  }
}
