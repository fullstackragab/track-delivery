import { Component, OnInit } from '@angular/core';
import { OrderStatusService, Point } from '../order-status.service';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
})
export class OrderStatusComponent implements OnInit {
  vehicle: string = 'Bicycle';
  points: Point[] = [];
  currentPoint!: Point;
  currentIndex = -1;
  start: number[] = [];

  constructor(
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
    this.start = [this.points[0].location.long, this.points[0].location.lat];
  }

  onChange(value: string) {
    this.vehicle = value;
  }

}
