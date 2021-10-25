import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}

  getRouteCoordinates(
    profile: string,
    locations: string
  ): Observable<number[][]> {
    return this.http
      .get(
        `https://api.mapbox.com/directions/v5/mapbox/${profile}/${locations}?geometries=geojson&access_token=${environment.mapboxToken}`
      )
      .pipe(map((res: any) => res.routes[0].geometry.coordinates));
  }
}
