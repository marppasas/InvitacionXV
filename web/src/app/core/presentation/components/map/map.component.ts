import { Component, Input, OnInit } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import * as proj from 'ol/proj';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import StyleIcon from 'ol/style/Icon';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

export interface LatLng {
    lat: number;
    lng: number;
}

export interface MapOptions {
    center: LatLng;
    marker?: LatLng[];
    zoom?: number;
}

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: [ './map.component.scss' ]
})
export class MapComponent implements OnInit {

    @Input() options: MapOptions;

    private map: Map;

    public ngOnInit(): void {
        this.initMap();
        
        for (let marker of this.options.marker ?? []) {
            this.addMarker(marker);
        }
    }

    private initMap(): void {
        this.map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM
                }),
            ],
            target: 'map',
            view: new View({
                center: proj.transform([ this.options.center.lat, this.options.center.lng ], 'EPSG:4326', 'EPSG:3857'),
                zoom: !!this.options.zoom ? this.options.zoom : 2,
                maxZoom: 18
            }),
        });
    }

    private addMarker(marker: LatLng): void {
        const layer = new VectorLayer({
            source: new VectorSource({
                features: [
                    new Feature({
                        geometry: new Point(proj.transform([ marker.lat, marker.lng ], 'EPSG:4326', 'EPSG:3857')),
                    }),
                ],
            }),
            style: new Style({
                image: new StyleIcon(({
                    anchor: [ 361, 992 ],
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 1,
                    scale: 0.025,
                    src: '../../../../../assets/icons/marker.png',
                })),
            }),
        });

        this.map.addLayer(layer);
    }

}