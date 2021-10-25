import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Point } from '../order-status.service';
import * as turf from '@turf/turf';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  mapBox!: mapboxgl.Map;
  @Input() points: Point[] = [];
  @Input() currentPoint!: Point;
  _vehicle: string = 'Bicycle';
  @Input() set vehicle(value: string) {
    this._vehicle = value;
    if (this.mapBox) this.drawRoutes();
  }
  @Input() currentIndex = -1;
  @ViewChild('map') mapContainer!: ElementRef<HTMLDivElement>;

  coordnates: number[][] = [];
  marker: mapboxgl.Marker = new mapboxgl.Marker({
    color: '#F84C4C', // color it red
  });
  @Input() start: number[] = [];

  constructor(private mapService: MapService) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    (mapboxgl as any).accessToken = environment.mapboxToken;
    this.mapBox = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [18.06354, 59.335591],
      zoom: 16,
    }).on('load', () => {
      this.drawMarkers();
      this.drawRoutes();
    });
  }

  drawFullRoute() {
    if (this.mapBox.getLayer('full-route'))
      this.mapBox.removeLayer('full-route');
    if (this.mapBox.getSource('full-route'))
      this.mapBox.removeSource('full-route');

    let locations = '';
    for (let i = 0; i < this.points.length; i++) {
      locations +=
        this.points[i].location.long + ',' + this.points[i].location.lat + ';';
    }
    if (locations.length > 0)
      locations = locations.substr(0, locations.length - 1);
    const profile = this.getProfile();
    this.mapService
      .getRouteCoordinates(profile, locations)
      .subscribe((coordinates) => {
        let route = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: coordinates,
              },
            },
          ],
        };

        (this.mapBox as any).addSource('full-route', {
          type: 'geojson',
          data: route,
        });

        this.mapBox.addLayer({
          id: 'full-route',
          source: 'full-route',
          type: 'line',
          paint: {
            'line-width': 3,
            'line-color': '#35cefc',
          },
        });
      });
  }

  animateRoute() {
    let locations = '';
    for (let i = 0; i <= this.currentIndex; i++) {
      locations +=
        this.points[i].location.long + ',' + this.points[i].location.lat + ';';
    }
    if (locations.length > 0)
      locations = locations.substr(0, locations.length - 1);
    const profile = this.getProfile();
    this.mapService
      .getRouteCoordinates(profile, locations)
      .subscribe((coordinates) => {
        if (this.mapBox.getLayer('route')) this.mapBox.removeLayer('route');

        if (this.mapBox.getLayer('point')) this.mapBox.removeLayer('point');

        if (this.mapBox.getSource('route'))
          (this.mapBox as any).removeSource('route');

        if (this.mapBox.getSource('point'))
          (this.mapBox as any).removeSource('point');

        let route = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: coordinates,
              },
            },
          ],
        };
        let point = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: this.start,
              },
            },
          ],
        };

        (this.mapBox as any).addSource('route', {
          type: 'geojson',
          data: route,
        });

        (this.mapBox as any).addSource('point', {
          type: 'geojson',
          data: point,
        });

        this.mapBox.addLayer({
          id: 'route',
          source: 'route',
          type: 'line',
          paint: {
            'line-width': 3,
            'line-color': '#3595fc',
          },
        });

        this.mapBox.addLayer({
          id: 'point',
          source: 'point',
          type: 'circle',
          paint: {
            'circle-color': 'blue',
          },
        });

        const lineDistance = (turf as any).length(route.features[0]);
        const steps = 300;
        const path: number[][] = [];
        for (let i = 0; i < lineDistance; i += lineDistance / steps) {
          const segment = (turf as any).along(route.features[0], i);
          path.push([
            segment.geometry.coordinates[0],
            segment.geometry.coordinates[1],
          ]);
        }

        this.animate(0, path, this.mapBox, point, route);
      });
  }

  drawMarkers() {
    let places: any = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    };

    for (let i = 0; i < this.points.length; i++) {
      const feature = {
        type: 'Feature',
        properties: {
          address: this.points[i].address,
        },
        geometry: {
          type: 'Point',
          coordinates: [
            this.points[i].location.long,
            this.points[i].location.lat,
          ],
        },
      };

      places.data.features.push(feature);
    }

    this.mapBox.addSource('places', places);
    this.mapBox.addLayer({
      id: 'places',
      type: 'circle',
      source: 'places',
      paint: {
        'circle-color': '#4264fb',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    this.mapBox.on('mouseenter', 'places', (e: any) => {
      // Change the cursor style as a UI indicator.
      this.mapBox.getCanvas().style.cursor = 'pointer';

      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const address = e.features[0].properties.address;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(address).addTo(this.mapBox);
    });

    this.mapBox.on('mouseleave', 'places', () => {
      this.mapBox.getCanvas().style.cursor = '';
      popup.remove();
    });
  }

  isCurrentPoint(point: Point) {
    return (
      point.location.long === this.currentPoint.location.long &&
      point.location.lat === this.currentPoint.location.lat
    );
  }

  drawRoutes() {
    this.drawFullRoute();
    this.animateRoute();
  }

  getProfile() {
    let profile = 'cycling';
    if (this._vehicle === 'Bicycle') {
      profile = 'cycling';
    } else if (this._vehicle == 'Car') {
      profile = 'driving';
    }
    return profile;
  }

  animate(counter: number, path: number[][], map: any, point: any, route: any) {
    if (counter >= path.length) return;

    point.features[0].geometry.coordinates = path[counter];

    map.getSource('point').setData(point);

    // Request the next frame of animation as long as the end has not been reached
    if (counter < path.length) {
      requestAnimationFrame(() => {
        this.animate(counter + 1, path, map, point, route);
      });
    }
  }
}
