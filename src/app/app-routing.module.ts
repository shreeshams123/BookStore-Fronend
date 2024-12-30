import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { BooksContainerComponent } from './components/books-container/books-container.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';

const routes: Routes = [
  {
    path:'',
    component:DashboardComponent,
    children:[
      {
        path:'books-container',
        component:BooksContainerComponent
      },
      {
        path:'book-details/:id',
        component:BookDetailsComponent
      }
    ]
  },
  {
    path:'login-signup',
    component:LoginSignupComponent
  }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
