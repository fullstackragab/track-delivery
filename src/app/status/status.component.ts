import { Component, Input, OnInit } from '@angular/core';
import { Point } from '../order-status.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  @Input() points: Point[] = [];
  @Input() currentIndex: number = -1;
  
  constructor() { }

  ngOnInit(): void {
  }

  isDone(i: number) {
    return this.currentIndex >= i;
  }

}
