import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  searchQuery:string='';
  constructor(private router:Router,private dataService:DataService){

  }
  ngOnInit(): void {
   this.router.navigate(["/books-container"])
  }
  handleSearchQuery() {
    this.dataService.updateSearchQuery(this.searchQuery)
  }

}
