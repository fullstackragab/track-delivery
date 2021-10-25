import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
  }

  getPoints() {
    return this.points;
  }

  getCurrentPoint() {
    return this.currentPoint;
  }

  updateAddress(address: string, long: number, lat: number) {
    this.points[this.points.length - 1].address = address;
    this.points[this.points.length - 1].location.long = long;
    this.points[this.points.length - 1].location.lat = lat;
  }
}
