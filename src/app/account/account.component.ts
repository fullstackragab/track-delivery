import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CompleterData, CompleterService } from 'ng2-completer';
import { environment } from 'src/environments/environment';
import { OrderStatusService } from '../order-status.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  datasource!: CompleterData;
  searchData = [];
  address = "";
  location: {long: number, lat: number} = {
    long: 0,
    lat: 0
  };

  constructor(
    private http: HttpClient,
    private orderStatusService: OrderStatusService,
    private completerService: CompleterService
  ) {}

  ngOnInit(): void {
    const p = this.orderStatusService.getCurrentAddress();
    this.address = p.address,
    this.location.long = p.location.long,
    this.location.lat = p.location.lat
  }

  onInput(str: string) {
    if(str && str.length > 2)
    this.http
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${str}.json?access_token=${environment.mapboxToken}`
      )
      .subscribe((res: any) => {
        if (res.features && res.features.length > 0) {
          this.datasource = this.completerService.local(res.features, 'place_name', 'place_name')//.map((feature: any) => feature.place_name)
        }
      });
  }

  onSave() {
    this.orderStatusService.updateAddress(this.address, this.location.long, this.location.lat)
  }

  onSelected(event: any) {
    this.address = event.title
    this.location = {
      long: event.originalObject.center[0],
      lat: event.originalObject.center[1]
    }
  }
}
