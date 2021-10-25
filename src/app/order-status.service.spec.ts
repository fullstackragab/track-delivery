import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OrderStatusService, Point } from './order-status.service';

describe('OrderStatusService', () => {
  let service: OrderStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(OrderStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get points', () => {
    const points: Point[] = [
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

    expect(service.getPoints()).toEqual(points)
  })

  it('should get current point', () => {
    const currentPoint: Point = {
      title: 'Package at warehouse',
      location: {
        long: 18.06354,
        lat: 59.335591,
      },
      address: "Burger King, Hötorget, Stockholm, Stockholm 111 35, Sweden"
    };

    expect(service.getCurrentPoint()).toEqual(currentPoint)
  })

  it('should update address', () => {
    const address = "New address";
    const long = 18.666655
    const lat = 59.999555

    const length = service.getPoints().length
    const point = service.getPoints()[length - 1]
    expect(point.address).not.toEqual(address)
    expect(point.location.long).not.toEqual(long)
    expect(point.location.lat).not.toEqual(lat)

    service.updateAddress(address, long, lat)

    const point2 = service.getPoints()[length - 1]
    expect(point2.address).toEqual(address)
    expect(point2.location.long).toEqual(long)
    expect(point2.location.lat).toEqual(lat)
  })
});
