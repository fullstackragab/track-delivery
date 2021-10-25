import { Component, OnInit } from '@angular/core';
import { AddressService } from '../address.service';
import { OrderStatusService } from '../order-status.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  data: {
    id: string,
    address: string,
    center: number[]
  }[] = [{
    "id": "address.5058343513358978",
    "address": "Apelbergsgatan 54, 111 36 Stockholm, Sweden",
    "center": [
        18.059727,
        59.335169
    ]
}];
  selectedAddress =  "address.5058343513358978"
  selectedItem = {
    "id": "address.5058343513358978",
    "address": "Apelbergsgatan 54, 111 36 Stockholm, Sweden",
    "center": [
        18.059727,
        59.335169
    ]
}
  saved = false;

  constructor(
    private addressService: AddressService,
    private orderStatusService: OrderStatusService
  ) {}

  ngOnInit(): void {
    this.data = this.addressService.getInitialData()
    this.selectedAddress = this.addressService.getCurrentItem().id
  }

  onSearch(event: any) {
    if (event.term && event.term.length > 2 )
      this.addressService.getData(event.term).subscribe(data => this.data = data)
  }

  onSave() {
    this.orderStatusService.updateAddress(
      this.selectedItem.address,
      this.selectedItem.center[0],
      this.selectedItem.center[1]
    );
    this.saved = true;
  }

  onChange(item: any) {
    if (item) {
      this.data = []
      this.data.push(item)
      this.selectedAddress = item.id
      this.selectedItem = item
      this.addressService.setCurrentItem(item)
    }
  }
}
