import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { OrderStatusComponent } from './order-status/order-status.component';

const routes: Routes = [
  { path: '', redirectTo: '/track-orders', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'update-delivery-address', component: AccountComponent },
  { path: 'track-orders', component: OrderStatusComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
