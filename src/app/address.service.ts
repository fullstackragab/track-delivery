import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private data: {
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
  private currentItem = {
    "id": "address.5058343513358978",
    "address": "Apelbergsgatan 54, 111 36 Stockholm, Sweden",
    "center": [
        18.059727,
        59.335169
    ]
}

  constructor(private http: HttpClient) { }

  getData(term: string) {
    return this.http
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${term}.json?access_token=${environment.mapboxToken}`
        )
        .pipe(map((res: any) => {
          if (res.features && res.features.length > 0) {
            return res.features.map((item: any) => ({
              id: item.id,
              address: item.place_name,
              center: [item.center[0], item.center[1]]
            }));
          }
          return res
        }));
  }

  getInitialData() {
    return this.data;
  }

  getCurrentItem() {
    return this.currentItem
  }

  setCurrentItem(item: any) {
    this.currentItem = item
    this.data = []
    this.data.push(item)
  }
}
