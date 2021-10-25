import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { AddressService } from './address.service';
import { environment } from 'src/environments/environment';

describe('AddressService', () => {
  let service: AddressService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
    service = TestBed.inject(AddressService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get initial data', () => {
   const data: {
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
    expect(service.getInitialData()).toEqual(data)
  })

  it('should get current item', () => {

    const currentItem = {
      "id": "address.5058343513358978",
      "address": "Apelbergsgatan 54, 111 36 Stockholm, Sweden",
      "center": [
          18.059727,
          59.335169
      ]
    }

    expect(service.getCurrentItem()).toEqual(currentItem)
  })

  it('should set current item', () => {
    const currentItem = {
      "id": "address.5058343513358999",
      "address": "Olof Palme Memorial, Sveavägen, Stockholm, Stockholm 111 37, Sweden",
      "center": [
          18.059827,
          59.335169
      ]
    }

    expect(service.getCurrentItem()).not.toEqual(currentItem)
    service.setCurrentItem(currentItem)
    expect(service.getCurrentItem()).toEqual(currentItem)
  })

  it('should get data', () => {
    const mockData = { features: []}
    const term = 'olof'
    service.getData(term).subscribe(
      res => expect(res).toEqual(mockData)
    )
    const req = httpMock.expectOne(`https://api.mapbox.com/geocoding/v5/mapbox.places/${term}.json?access_token=${environment.mapboxToken}`)
    expect(req.request.method).toEqual('GET')
    req.flush(mockData)
    httpMock.verify()

  })
});
