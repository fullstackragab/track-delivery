import { Injectable } from '@angular/core';
import { OrderStatusService } from './order-status.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private orderStatusService: OrderStatusService) { }

  getCurrentAddress() {
    return this.orderStatusService.getPoints()[-1].location
  }
}
