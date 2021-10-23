import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Point {
  title: string;
  location: {
    long: number;
    lat: number;
  };
  address: string;
}

export enum Vehicle {
  Bicycle = 1,
  Car = 2,
}

@Injectable({
  providedIn: 'root',
})
export class OrderStatusService {
  currentPoint: Point = {
    title: 'Package at warehouse',
    location: {
      long: 18.06354,
      lat: 59.335591,
    },
    address: "Burger King, Hötorget, Stockholm, Stockholm 111 35, Sweden"
  };
  points: Point[] = [
    {
      title: 'Package sent from store',
      location: {
        long: 18.06654,
        lat: 59.334991,
      },
      address: "Oxtorgsgatan 5, 111 44 Stockholm, Sweden"
    },
    {
      title: 'Package at warehouse',
      location: {
        long: 18.06354,
        lat: 59.335591,
      },
      address: "Burger King, Hötorget, Stockholm, Stockholm 111 35, Sweden"
    },
    {
      title: 'Package arrived to destination',
      location: {
        long: 18.05954,
        lat: 59.335191,
      },
      address: "Apelbergsgatan 54, 111 37 Stockholm, Sweden"
    },
  ];

  constructor(private http: HttpClient) {
    this.populateAddresses();
  }

  populateAddresses() {
    this.points.forEach((point) => {
      this.getPlaceName(point.location.long, point.location.lat).subscribe(
        (res: any) => {
          point.address = res;
        }
      );
    });
  }

  getPoints() {
    return this.points;
  }

  getCurrentPoint() {
    return this.currentPoint;
  }

  getPlaceName(long: number, lat: number): Observable<string> {
    return this.http
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${environment.mapboxToken}`
      )
      .pipe(map((res: any) => res.features[0].place_name));
  }

  getCurrentAddress(): {address: string, location: {long: number, lat: number}} {
    const point = this.points[this.points.length - 1];
    return {
      address: point.address,
      location: {
        long: point.location.long,
        lat: point.location.lat
      }
    }
  }

  updateAddress(address: string, long: number, lat: number) {
    this.points[this.points.length - 1].address = address;
    this.points[this.points.length - 1].location.long = long;
    this.points[this.points.length - 1].location.lat = lat;
  }

  getLocation(address: string): Observable<{long: number, lat: number}> {
    return this.http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${environment.mapboxToken}`).pipe(map((res: any) => ({long: res.features[0].center[0], lat: res.features[0].center[1]})))
  }
}
