import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { MapService } from './map.service';

describe('MapService', () => {
  let service: MapService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MapService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get route coordinates', () => {
    const mockData = {
      res: {
        routes: [
          {
            geometry: {
              coordinates: [],
            },
          },
        ],
      },
    };
    const profile: string = 'cycling';
    const locations: string = '';
    service
      .getRouteCoordinates(profile, locations)
      .subscribe((res: any) => expect(res).toEqual(mockData.res.routes[0].geometry.coordinates));
    const res = httpMock.expectOne(
      `https://api.mapbox.com/directions/v5/mapbox/${profile}/${locations}?geometries=geojson&access_token=${environment.mapboxToken}`
    );
    expect(res.request.method).toEqual('GET');
    res.flush(mockData);
    httpMock.verify();
  });
});
