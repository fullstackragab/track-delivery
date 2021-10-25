import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
  @Output() changed = new EventEmitter<string>()

  constructor() { }

  ngOnInit(): void {
  }

  onChange(value: number) {
    if(value == 1)
      this.changed.emit('Bicycle')
    else if(value == 2)
      this.changed.emit('Car')
  }
}
