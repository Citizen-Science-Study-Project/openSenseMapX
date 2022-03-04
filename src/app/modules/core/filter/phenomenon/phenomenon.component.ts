import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UiQuery } from 'src/app/models/ui/state/ui.query';
import { UiService } from 'src/app/models/ui/state/ui.service';

@Component({
  selector: 'osem-phenomenon',
  templateUrl: './phenomenon.component.html',
  styleUrls: ['./phenomenon.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhenomenonComponent implements OnInit {

  @Input() selectedPheno;
  @Input() changeVariable: boolean = false;
  @Input() stats;

  @Output() phenoSelected = new EventEmitter();
  @Output() changeToggled = new EventEmitter();
  @Output() infoPhenoSelected = new EventEmitter();

  oldClustering = false;

  phenos = [
    {
      title: 'ALL',
      unit: '°C',
      layer: {
        'id': 'base-layer',
        'type': 'circle',
        'source': 'boxes',
        'paint': {
          'circle-stroke-width': 1,
          'circle-opacity': 0.7,
          'circle-radius': {
            'base': 1.75,
            'stops': [[1, 4], [22, 200]]
          },
          'circle-color': ['case', ['>=',
            ['to-string', ['get', 'lastMeasurementAt']],
            ['to-string', '2020-03-27']
          ], '#4EAF47', '#999']

          // 'circle-color': ['interpolate',
          // ['linear'],
          // ['get', 'lastMeasurementAt'],
          // "2020-03-27T15:47:53.481Z", '#009900',
          // "2020-03-17T15:47:53.481Z", '#ccc'
          // ]
          // 'circle-color': [
          //   'interpolate',
          //   ['linear'],
          //   [ "get", "Temperatur", ["object", ["get", "live", ["object", ["get", "sensors"]]]]],
          //   -5, '#000000',
          //   0, '#000000',
          //   10, '#000000',
          //   20, '#000000',
          //   30, '#000000'
          // ]
        }
      },
      icon: 'osem-thermometer',
    },
    {
      title: 'Temperatur',
      unit: '°C',
      layer: {
        'id': 'base-layer',
        'type': 'circle',
        'source': 'boxes',
        // 'filter': ["!=", null, [ "get", "Temperatur", ["object", ["get", "live", ["object", ["get", "sensors"]]]]]],
        'filter': ['!=', null, ['get', 'value', ['object', ['get', 'Temperatur', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]]],
        'paint': {
          'circle-opacity': 0.7,
          'circle-radius': {
            'base': 1.75,
            'stops': [[1, 4], [22, 200]]
          },
          'circle-color': [
            'interpolate',
            ['linear'],
            // [ "get", "Temperatur", ["object", ["get", "live", ["object", ["get", "sensors"]]]]],
            ['get', 'value', ['object', ['get', 'Temperatur', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]],
            -5, '#9900cc',
            0, '#0000ff',
            10, '#0099ff',
            20, '#ffff00',
            30, '#ff0000'
          ]
        }
      },
      icon: 'osem-thermometer',
    }, {
      title: 'rel. Luftfeuchte',
      unit: '%',
      layer: {
        'id': 'base-layer',
        'type': 'circle',
        'source': 'boxes',
        // 'filter': ["!=", null, [ "get", "rel. Luftfeuchte", ["object", ["get", "live", ["object", ["get", "sensors"]]]]]],
        'filter': ['!=', null, ['get', 'value', ['object', ['get', 'rel. Luftfeuchte', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]]],
        'paint': {
          'circle-opacity': 0.7,
          'circle-radius': {
            'base': 1.75,
            'stops': [[1, 4], [22, 200]]
          },
          'circle-color': [
            'interpolate',
            ['linear'],
            // [ "get", "rel. Luftfeuchte", ["object", ["get", "live", ["object", ["get", "sensors"]]]]],
            ['get', 'value', ['object', ['get', 'rel. Luftfeuchte', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]],
            0, '#9900cc',
            25, '#0000ff',
            50, '#0099ff',
            75, '#ffff00',
            100, '#ff0000',
          ]
        }
      },
      icon: 'osem-humidity'
    },
    {
      title: 'Luftdruck',
      unit: 'hPa',
      layer: {
        'id': 'base-layer',
        'type': 'circle',
        'source': 'boxes',
        // 'filter': ["!=", null, [ "get", "Luftdruck", ["object", ["get", "live", ["object", ["get", "sensors"]]]]]],
        'filter': ['!=', null, ['get', 'value', ['object', ['get', 'Luftdruck', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]]],
        'paint': {
          'circle-opacity': 0.7,
          'circle-radius': {
            'base': 1.75,
            'stops': [[1, 4], [22, 200]]
          },
          'circle-color': [
            'interpolate',
            ['linear'],
            // [ "get", "Luftdruck", ["object", ["get", "live", ["object", ["get", "sensors"]]]]],
            ['get', 'value', ['object', ['get', 'Luftdruck', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]],
            0, '#9900cc',
            25, '#0000ff',
            50, '#0099ff',
            75, '#ffff00',
            100, '#ff0000',
          ]
        }
      },
      icon: 'osem-barometer'
    },
    {
      title: 'Beleuchtungsstärke',
      unit: 'lux',
      layer: {
        'id': 'base-layer',
        'type': 'circle',
        'source': 'boxes',
        // 'filter': ["!=", null, [ "get", "Beleuchtungsstärke", ["object", ["get", "live", ["object", ["get", "sensors"]]]]]],
        'filter': ['!=', null, ['get', 'value', ['object', ['get', 'Beleuchtungsstärke', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]]],
        'paint': {
          'circle-opacity': 0.7,
          'circle-radius': {
            'base': 1.75,
            'stops': [[1, 4], [22, 200]]
          },
          'circle-color': [
            'interpolate',
            ['linear'],
            // [ "get", "Beleuchtungsstärke", ["object", ["get", "live", ["object", ["get", "sensors"]]]]],
            ['get', 'value', ['object', ['get', 'Beleuchtungsstärke', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]],
            0, '#9900cc',
            1000, '#0000ff',
            2000, '#0099ff',
            3000, '#ffff00',
            4000, '#ff0000',
          ]
        }
      },
      icon: 'osem-brightness'
    },
    {
      title: 'UV-Intensität',
      unit: 'μW/cm²',
      layer: {
        'id': 'base-layer',
        'type': 'circle',
        'source': 'boxes',
        // 'filter': ["!=", null, [ "get", "UV-Intensität", ["object", ["get", "live", ["object", ["get", "sensors"]]]]]],
        'filter': ['!=', null, ['get', 'value', ['object', ['get', 'UV-Intensität', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]]],
        'paint': {
          'circle-opacity': 0.7,
          'circle-radius': {
            'base': 1.75,
            'stops': [[1, 4], [22, 200]]
          },
          'circle-color': [
            'interpolate',
            ['linear'],
            // [ "get", "UV-Intensität", ["object", ["get", "live", ["object", ["get", "sensors"]]]]],
            ['get', 'value', ['object', ['get', 'UV-Intensität', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]],
            0, '#9900cc',
            100, '#0000ff',
            200, '#0099ff',
            300, '#ffff00',
            400, '#ff0000',
          ]
        }
      },
      icon: 'osem-brightness'
    },
    {
      title: 'PM10',
      unit: 'µg/m³',
      layer: {
        'id': 'base-layer',
        'type': 'circle',
        'source': 'boxes',
        // 'filter': ["!=", null, [ "get", "PM10", ["object", ["get", "live", ["object", ["get", "sensors"]]]]]],
        'filter': ['!=', null, ['get', 'value', ['object', ['get', 'PM10', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]]],
        'paint': {
          'circle-opacity': 0.7,
          'circle-radius': {
            'base': 1.75,
            'stops': [[1, 4], [22, 200]]
          },
          'circle-color': [
            'interpolate',
            ['linear'],
            // [ "get", "PM10", ["object", ["get", "live", ["object", ["get", "sensors"]]]]],
            ['get', 'value', ['object', ['get', 'PM10', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]],
            0, '#9900cc',
            15, '#0000ff',
            30, '#0099ff',
            45, '#ffff00',
            60, '#ff0000',
          ]
        }
      },
      icon: 'osem-cloud'
    },
    {
      title: 'PM2.5',
      unit: 'µg/m³',
      layer: {
        'id': 'base-layer',
        'type': 'circle',
        'source': 'boxes',
        // 'filter': ["!=", null, [ "get", "PM2.5", ["object", ["get", "live", ["object", ["get", "sensors"]]]]]],
        'filter': ['!=', null, ['get', 'value', ['object', ['get', 'PM2.5', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]]],
        'paint': {
          'circle-opacity': 0.7,
          'circle-radius': {
            'base': 1.75,
            'stops': [[1, 4], [22, 200]]
          },
          'circle-color': [
            'interpolate',
            ['linear'],
            // [ "get", "PM2.5", ["object", ["get", "live", ["object", ["get", "sensors"]]]]],
            ['get', 'value', ['object', ['get', 'PM2.5', ['object', ['get', 'live', ['object', ['get', 'sensors']]]]]]],
            0, '#9900cc',
            10, '#0000ff',
            20, '#0099ff',
            30, '#ffff00',
            40, '#ff0000',
          ]
        }
      },
      icon: 'osem-cloud'
    }
  ];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private uiService: UiService, private uiQuery: UiQuery) {
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      //if no pheno in URL open ALL layer
      if (!params.mapPheno){
        this.phenoSelected.emit(this.phenos.find(pheno => pheno.title === 'ALL'));
        this.oldClustering = this.uiQuery.getValue().clustering;
        this.uiService.setClustering(false);
        this.uiService.setNumbers(false);
      }
      if (params.mapPheno){
        if (!this.selectedPheno || this.selectedPheno.title != params.mapPheno)
          this.phenoSelected.emit(this.phenos.find(pheno => pheno.title === params.mapPheno));

        if (params.mapPheno === 'ALL'){
          this.oldClustering = this.uiQuery.getValue().clustering;
          this.uiService.setClustering(false);
          this.uiService.setNumbers(false);
        } else {
          if (!this.uiQuery.getValue().clustering){
            this.uiService.setNumbers(true);
          }
        }

        if (this.selectedPheno && this.selectedPheno.title === 'ALL'){
          this.uiService.setClustering(this.oldClustering);
          if (this.oldClustering){
            this.uiService.setNumbers(false);
          }
        }
      }
    });
  }

  selectPheno(pheno) {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {mapPheno: pheno.title},
        queryParamsHandling: 'merge'
      });
  }

  toggleChange() {
    this.changeToggled.emit();
    // this.changeVariable = !this.changeVariable;
    // console.log(this.changeVariable)
  }

  showInfo(pheno) {
    this.infoPhenoSelected.emit(pheno);
  }

  openVis(pheno) {
    this.router.navigate(
      [{outlets: {modal: 'vis'}}],
      {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge'
      }
    );
  }

  editLegend() {
    this.router.navigate(
      [{outlets: {modal: 'edit-legend'}}],
      {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge'
      }
    );
  }
}
