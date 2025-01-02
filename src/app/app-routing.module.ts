import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { BooksContainerComponent } from './components/books-container/books-container.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { CartContainerComponent } from './components/cart-container/cart-container.component';
import { WishlistContainerComponent } from './components/wishlist-container/wishlist-container.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { OrderContainerComponent } from './components/order-container/order-container.component';
import { LoginPromptComponent } from './components/login-prompt/login-prompt.component';
import { ProfileComponent } from './components/profile/profile.component';

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
      },
      {
        path:'cart',
        component:CartContainerComponent
      },
      {
        path:'wishlist',
        component:WishlistContainerComponent
      },
      {
        path:'orderSuccess',
        component:OrderSuccessComponent
      },
      {
        path:'orders',
        component:OrderContainerComponent
      },
      {
        path:'profile',
        component:ProfileComponent
      }
    ]
  },
  {
    path:'login-signup',
    component:LoginSignupComponent
  },
  {
    path:'login-prompt',
    component:LoginPromptComponent
  }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
