import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Map } from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { OrderStatusService, Point } from '../order-status.service';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
})
export class OrderStatusComponent implements OnInit {
  map!: Map;
  points: Point[] = [];
  currentPoint!: Point;
  vehicle: number = 1;
  currentIndex = -1;

  constructor(
    private http: HttpClient,
    private orderStatusService: OrderStatusService
  ) {}

  ngOnInit(): void {
    this.points = this.orderStatusService.getPoints();
    this.currentPoint = this.orderStatusService.getCurrentPoint();
    this.currentIndex = this.points.findIndex(
      (point) =>
        point.location.long == this.currentPoint.location.long &&
        point.location.lat === this.currentPoint.location.lat
    );
  }

  drawRoutes() {
    let locations = '';
    this.points.forEach((point) => {
      locations += point.location.long + ',' + point.location.lat + ';';
    });
    locations = locations.substr(0, locations.length - 1);
    let profile = 'cycling';
    if (this.vehicle == 1) {
      profile = 'cycling';
    } else if (this.vehicle == 2) {
      profile = 'driving';
    }
    this.http
      .get(
        `https://api.mapbox.com/directions/v5/mapbox/${profile}/${locations}?geometries=geojson&access_token=${environment.mapboxToken}`
      )
      .subscribe((response: any) => {
        const route = response.routes[0].geometry.coordinates;
        const geojson: any = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        };
        if (this.map.getSource('route')) {
          (this.map.getSource('route') as any).setData(geojson);
        } else {
          this.map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: geojson,
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5,
              'line-opacity': 0.75,
            },
          });
        }
      });
  }

  isCurrentPoint(point: Point) {
    return (
      point.location.long === this.currentPoint.location.long &&
      point.location.lat === this.currentPoint.location.lat
    );
  }

  isDone(i: number) {
    return this.currentIndex >= i;
  }

  onChange(value: number) {
    this.vehicle = value;
    this.drawRoutes();
  }
}
