import { Injectable } from '@angular/core';
import { Map, NavigationControl } from 'mapbox-gl';

import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';
import { Box } from 'src/app/models/box/state/box.model';
import { BoxQuery } from 'src/app/models/box/state/box.query';
import { BoxService } from 'src/app/models/box/state/box.service';
import { UiService } from 'src/app/models/ui/state/ui.service';
import { Router, ActivatedRoute } from '@angular/router';
import { arrayRemove } from '../box/osem-line-chart/helper/helpers';
import { withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(
    private boxQuery: BoxQuery, 
    private boxService: BoxService, 
    private uiService: UiService, 
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { 
    this.compareModus$.pipe(withLatestFrom(this.compareTo$)).subscribe(res => {
      this.compareModus = res[0];
      if(this.map && this.map.getLayer('base-layer')){
        if(res[0]){
          this.map.off('mouseenter', 'base-layer', this.baseMouseenterFunction);
          this.map.off('click', 'base-layer', this.baseClickFunction);
          this.map.on('mouseenter', 'base-layer', this.compareMouseenterFunction);
          this.map.on('click', 'base-layer', this.compareClickFunction);
        } else {
          this.map.off('click', 'base-layer', this.compareClickFunction);
          this.map.off('mouseenter', 'base-layer', this.compareMouseenterFunction);
          this.map.on('mouseenter', 'base-layer', this.baseMouseenterFunction);
          this.map.on('click', 'base-layer', this.baseClickFunction);
        }

        if(res[1].length > 0){
          this.map.setFilter('active-layer', ["match", ["get", "_id"], res[1], true, false ]);        
        }
      }
    })
  }

  map;
  popup;
  boxes$: Observable<Box[]>;
  // layers$;
  // baseLayer$;
  // activeBox$ = this.boxQuery.selectActiveId();
  compareModus$ = this.boxQuery.selectCompareModus$;
  compareTo$ = this.boxQuery.selectCompareTo$;
  compareModus: Boolean = false;

  baseLayersInit: Boolean = false;
  dataInit = false;
  oldFilter;

  generateMap(elementName) {
    
    console.log("Initmap")
    let that = this;

    // this.boxService.get().subscribe();
    (mapboxgl as typeof mapboxgl).accessToken = "pk.eyJ1IjoidW11dDAwIiwiYSI6ImNqbnVkbnFxNDB2YnIzd3M1eTNidTA3MjUifQ.3gqG1JYEQvckOiiQ8B3NQQ";
    this.map = new Map({
      container: elementName,
      style: 'mapbox://styles/mapbox/light-v9',
      center: [13.5,52.4],
      zoom: 8,
      pitch: 21
    });

    this.map.addControl(new NavigationControl());

    this.map.on('style.load', function(){
      console.log("LOADING");
      that.boxService.setMapInit(true);
    })
    
    // this.boxes$ = this.boxQuery.selectAll();

    // this.layers$ = this.boxQuery.select(ent => ent.ui.layers);

    // this.map.on('load', function(){
    //   that.boxes$.subscribe(boxes => {
    //     console.log("newBoxes");
    //     boxes = that.convertLastMeasurement(boxes);
    //     if(!that.map.getSource('boxes')){
    //       that.map.addSource('boxes', {
    //         type: "geojson",
    //         data: that.toGeoJson(boxes)
    //       })
    //     } else {
    //       console.log(that.toGeoJson(boxes));
    //       that.map.getSource('boxes').setData(that.toGeoJson(boxes));
    //     }
    //   });

    //   that.activeBox$.subscribe(res => {
    //     if(res){
    //       if(!that.map.getLayer('active-layer')){
    //         that.map.addLayer({
    //           'id': 'active-layer-text',
    //           'type': 'symbol',
    //           'source': 'boxes',
    //           'filter': ["==", res, ["get", "_id"]],
    //           "paint": {
    //             'text-color': '#FFFFFF',
    //             'text-halo-blur': 2,
    //             'text-halo-color': '#000000',
    //             'text-halo-width': 2
    //           },
    //           "layout": {
    //             "text-field": ["get", "name"],
    //             "text-variable-anchor": ["top"],
    //             "text-offset": [0,1],
    //             // "text-font": [
    //             //   "DIN Offc Pro Medium",
    //             //   "Arial Unicode MS Bold"
    //             // ],
    //             "text-size": 15
    //           } 
    //         });
    //         that.map.addLayer({
    //           'id': 'active-layer',
    //           'type': 'circle',
    //           'source': 'boxes',
    //           'filter': ["==", res, ["get", "_id"]],
    //           'paint': {
    //           'circle-radius': {
    //             'base': 1.75,
    //             'stops': [[1, 10], [22, 3580]]
    //           },
    //           'circle-blur': 0.6,
    //           // 'circle-stroke-width': 1,
    //           'circle-opacity': 0.6,
    //           'circle-color': '#FFFFFF'
    //           } 
    //         }, 'active-layer-text');
            
    //         if(that.map.getLayer('base-layer'))
    //           that.map.moveLayer('base-layer', 'active-layer-text')
    //       } else {
    //         that.map.setFilter('active-layer', ["==", res, ["get", "_id"]])
    //         that.map.setFilter('active-layer-text', ["==", res, ["get", "_id"]])
    //       }
    //     }
    //   })

    //   that.layers$.subscribe(layers => {
    //     layers.forEach(element => {
    //       console.log(element);
    //       if(!that.map.getLayer(element.id)) {
    //         that.map.addLayer(element);
    //         if(that.map.getLayer('active-layer-text'))
    //           that.map.moveLayer(element.id, 'active-layer-text')
    //       } else {
    //         that.map.setPaintProperty(element.id, 'circle-color', element.paint['circle-color']);
    //         if(element.filter){
    //           that.map.setFilter(element.id, element.filter);
    //         } else {
    //           that.map.setFilter(element.id);
    //         }
    //       }
    //     });
    //   });
    //   //add mouse functions for base-layer
    //   that.addPopup('base-layer');
    //   that.addClickFuntion('base-layer');
    // });
  }


  convertLastMeasurement(data){
    let returnData = data.map(box => {
      let newValues = {}
      if(box.sensors){
        box.sensors.map(sensor => {
          if(sensor && sensor.lastMeasurement){
            let newSensor = { };
            // newSensor[sensor.title] =  sensor.lastMeasurement.value
            newValues[sensor.title] =  parseFloat(sensor.lastMeasurement.value)
          }
          return null;
        })
      }
      let newBox = {...box, live: newValues};
      return newBox;
    })
    return returnData;
  }
  // convertLastMeasurement(data){
  //   let returnData = data.map(item => {
  //     let newItemSensor = item.sensors.map(sensor => {
  //       if(sensor.lastMeasurement){
  //         let newItem = {...item, values: {} }
  //         newItem.values[sensor.title] = {last: sensor.lastMeasurement.value}
  //         console.log(newItem);
  //         return newItem;
  //       }
  //     })
  //     return {...item, sensors: newItemSensor};
  //   })
  //   console.log(returnData);
  //   return data;
  // }


  toGeoJson(data){
    let geojson = data.filter(item => item.currentLocation).map(item => {
      if(item.currentLocation){
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: item.currentLocation.coordinates,
          },
          properties: {
            name: item.name,
            _id: item._id,
            exposure: item.exposure,
            state: item.state,
            sensors: item.sensors,
            values: item.values ? item.values : null,
            live: item.live ? item.live : null
          }
        }
      }
    });

    geojson = {
      type: 'FeatureCollection',
      features: geojson
    };
    return geojson; 
  }

  addClickFuntion(layer) {
    this.map.on('click', layer, this.baseClickFunction);
  }

  baseClickFunction = e => {
    if(e.features.length > 0){
      this.router.navigate(['/explore/'+e.features[0].properties._id],  {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge'
      });
    }
  }

  compareClickFunction = e => {

    if(e.features.length > 0){

      let newIds = [];
      if(this.activatedRoute.snapshot.queryParams.id){
        if(Array.isArray(this.activatedRoute.snapshot.queryParams.id)){
          if(this.activatedRoute.snapshot.queryParams.id.indexOf(e.features[0].properties._id) != -1){
            newIds = arrayRemove(this.activatedRoute.snapshot.queryParams.id, e.features[0].properties._id)
          } else {
            newIds = [...this.activatedRoute.snapshot.queryParams.id, e.features[0].properties._id]
          }
        } else {
          if(this.activatedRoute.snapshot.queryParams.id === e.features[0].properties._id){
            newIds = []
          } else {
            newIds = [this.activatedRoute.snapshot.queryParams.id, e.features[0].properties._id]
          }
        }
      }
      this.router.navigate(
        [], 
        {
          relativeTo: this.activatedRoute,
          queryParams: { id: newIds },
          queryParamsHandling: 'merge'
        });
      // this.boxService.toggleCompareTo(e.features[0].properties._id);
    }
  }

  addPopup(layer) {
    let that = this;

    // this.popup = new mapboxgl.Popup({
    //   closeButton: false,
    //   closeOnClick: false
    // });
       
    this.map.on('mouseenter', layer, this.baseMouseenterFunction);
      
    this.map.on('mouseleave', layer, function() {
      that.map.getCanvas().style.cursor = '';
      // that.popup.remove();
      that.boxService.setPopupBox(null);
    });

  }

  setCompareModusClickFunctions(){
    this.map.off('mouseenter', 'base-layer', this.baseMouseenterFunction);
    this.map.off('click', 'base-layer', this.baseClickFunction);
    this.map.on('mouseenter', 'base-layer', this.compareMouseenterFunction);
    this.map.on('click', 'base-layer', this.compareClickFunction);
  }

  baseMouseenterFunction = e => {
    this.map.getCanvas().style.cursor = 'pointer';

      
    var coordinates = e.features[0].geometry.coordinates.slice();
    let pixelPosition = this.map.project(coordinates);
    let box = e.features[0].properties;
    
    this.boxService.setPopupBox({...box, sensors : JSON.parse(e.features[0].properties.sensors)});

    document.getElementById("popuptest").style.top = pixelPosition.y + 'px';
    document.getElementById("popuptest").style.left = pixelPosition.x + 'px';
    document.getElementById("popuptest").style.display = 'block';

    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    // }

    // let description = "<h3>" + e.features[0].properties.name + '</h3>' + e.features[0].properties.values

    // let sensors = JSON.parse(e.features[0].properties.sensors);
    // for(let sensor in sensors) {
    //   let sensorItem = sensors[sensor];
    //   description += '<p>' + sensorItem.title + '</p>'
    // }

    // this.popup.setLngLat(coordinates)
    //   .setHTML(description)
    //   .addTo(this.map);

  }

  compareMouseenterFunction = e => {
    this.map.getCanvas().style.cursor = 'cell';

      
    var coordinates = e.features[0].geometry.coordinates.slice();
    let pixelPosition = this.map.project(coordinates);
    let box = e.features[0].properties;

    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    // }

    // let description = "<h3>" + e.features[0].properties.name + '</h3>' + e.features[0].properties.values

    // let sensors = JSON.parse(e.features[0].properties.sensors);
    // for(let sensor in sensors) {
    //   let sensorItem = sensors[sensor];
    //   description += '<p>' + sensorItem.title + '</p>'
    // }

    this.boxService.setPopupBox({...box, sensors : JSON.parse(e.features[0].properties.sensors)});

    document.getElementById("popuptest").style.top = pixelPosition.y + 'px';
    document.getElementById("popuptest").style.left = pixelPosition.x + 'px';
    document.getElementById("popuptest").style.display = 'block';



    // this.popup.setLngLat(coordinates)
    //   .setHTML(description)
    //   .addTo(this.map);
  }


  setMapData(boxes) {
    
    this.updateBoxesData(boxes, this.map);
    // if(!this.waitingForLoadBox){
    //   if(this.map.isStyleLoaded()){
    //   } else {
    //     this.executeWhenLoaded.push([this.updateBoxesData, boxes])
    //     // this.waitingForLoadBox = true;
    //     // this.map.on('load', () => {
    //     //   // this.setMapData(boxes);
    //     //   this.updateBoxesData(boxes);
    //     //   this.waitingForLoadBox = false;
    //     // })
    //   }
    // }
  }


  updateBoxesData(boxes, map){
    boxes = this.convertLastMeasurement(boxes);
  
    if(!map.getSource('boxes')){
      map.addSource('boxes', {
        type: "geojson",
        data: this.toGeoJson(boxes)
      })
    } else {
      map.getSource('boxes').setData(this.toGeoJson(boxes));
    }
    this.boxService.setDataInit(true);
  }


  setMapLayers(layers){
    this.drawLayers(layers, this.map);

    // if(!this.baseLayersInit)
    //   this.initBaseLayer();
    // if(!this.waitingForLoadLayer){
    //   if(this.map && this.map.isStyleLoaded()){
    //   } else {
    //     this.executeWhenLoaded.push([this.drawLayers, layers])
    //     // this.waitingForLoadLayer = true;
    //     // this.map.on('load', () => {
    //     //   // this.setMapData(boxes);
    //     //   this.drawLayers(layers);
    //     //   this.waitingForLoadLayer = false;
    //     // })
    //   }
    // }
  }


  drawLayers(layers, map) {  

    layers.forEach(element => {
      
      if(!map.getLayer(element.id)) {
        map.addLayer(element);

        if(map.getLayer('active-layer-text'))
        map.moveLayer(element.id, 'active-layer-text');
        
      } else {
        
        map.setPaintProperty(element.id, 'circle-color', element.paint['circle-color']);
        
        if(element.filter){
          map.setFilter(element.id, element.filter);
        } else {
          map.setFilter(element.id);
        }
      }
      if(!map.getLayer('number-layer')){
        this.addNumberLayer();
      }
      map.setPaintProperty('number-layer', 'text-color', element.paint['circle-color']);
      map.setLayoutProperty('number-layer', 'text-field', element.paint['circle-color'][2]);
    });
  }
  
  
  updateActiveLayer(id, theme){

    if(id !== undefined){
      let paint;
      if(theme === 'dark'){
        paint = {
          'text-color': '#f6f6f6',
          'text-halo-blur': 4,
          'text-halo-color': '#383838',
          'text-halo-width': 1
        }
      } else {
          paint = {
            'text-color': '#383838',
            'text-halo-blur': 4,
            'text-halo-color': '#f6f6f4',
            'text-halo-width': 1
          }
      }
      if(!this.map.getLayer('active-layer')){
        this.map.addLayer({
          'id': 'active-layer-text',
          'type': 'symbol',
          'source': 'boxes',
          'filter': ["==", id, ["get", "_id"]],
          "paint": paint,
          "layout": {
            "text-field": ['format', ["get", "name"], { 'font-scale': 1.2 }],
            "text-variable-anchor": ["top"],
            "text-offset": [0,1],
            // "text-font": [
            //   "DIN Offc Pro Medium",
            //   "Arial Unicode MS Bold"
            // ],
            "text-size": 18
          } 
        });
        this.map.addLayer({
          'id': 'active-layer',
          'type': 'circle',
          'source': 'boxes',
          'filter': ["==", id, ["get", "_id"]],
          // 'filter': ["match", ["get", "_id"], ["5da0a27f25683a001a59271b", "5bf837bf86f11b001aae7f82"], true, false ],
          'paint': {
          'circle-radius': {
            'base': 1.75,
            'stops': [[1, 10], [22, 3580]]
          },
          'circle-blur': 0.6,
          // 'circle-stroke-width': 1,
          'circle-opacity': 0.6,
          'circle-color': '#FFFFFF'
          } 
        }, 'base-layer');
        
      } else {
  
        this.map.setFilter('active-layer', ["==", id, ["get", "_id"]]);
        this.map.setFilter('active-layer-text', ["==", id, ["get", "_id"]]);
        // this.map.setFilter('active-layer', ["match", ["get", "_id"], ["5da0a27f25683a001a59271b", "5bf837bf86f11b001aae7f82"], true, false ]);
        // this.map.setFilter('active-layer-text', ["==", id, ["get", "_id"]]);
      }

    }
  }
  
  updateActiveLayerCompare(data, theme){
    if(data.length > 0){
      let paint;
      if(theme === 'dark'){
        paint = {
          'text-color': '#f6f6f6',
          'text-halo-blur': 4,
          'text-halo-color': '#383838',
          'text-halo-width': 1
        }
      } else {
          paint = {
            'text-color': '#383838',
            'text-halo-blur': 4,
            'text-halo-color': '#f6f6f4',
            'text-halo-width': 1
          }
      }
      if(!this.map.getLayer('active-layer')){
        this.map.addLayer({
          'id': 'active-layer-text',
          'type': 'symbol',
          'source': 'boxes',
          'filter': ["match", ["get", "_id"], data, true, false ],
          // 'filter': ["==", id, ["get", "_id"]],
          "paint": paint,
          "layout": {
            "text-field": ['format', ["get", "name"], { 'font-scale': 1.2 }],
            "text-variable-anchor": ["top"],
            "text-offset": [0,1],
            // "text-font": [
            //   "DIN Offc Pro Medium",
            //   "Arial Unicode MS Bold"
            // ],
            "text-size": 18
          } 
        });
        this.map.addLayer({
          'id': 'active-layer',
          'type': 'circle',
          'source': 'boxes',
          // 'filter': ["==", id, ["get", "_id"]],
          'filter': ["match", ["get", "_id"], data, true, false ],
          'paint': {
          'circle-radius': {
            'base': 1.75,
            'stops': [[1, 10], [22, 2580]]
          },
          'circle-blur': 0.6,
          // 'circle-stroke-width': 1,
          'circle-opacity': 0.6,
          'circle-color': '#eee'
          } 
        }, 'base-layer');
        
      } else {
        // this.map.setFilter('active-layer', ["==", data, ["get", "_id"]]);
        // this.map.setFilter('active-layer-text', ["==", data, ["get", "_id"]]);
        console.log(data);
        this.map.setFilter('active-layer-text', ["match", ["get", "_id"], data, true, false ]);
        this.map.setFilter('active-layer', ["match", ["get", "_id"], data, true, false ]);
        // this.map.setFilter('active-layer-text', ["==", id, ["get", "_id"]]);
      }    
    }
  }
  
  addNumberLayer(){
    this.map.addLayer({
      'id': 'number-layer',
      'type': 'symbol',
      'source': 'boxes',
      "paint": {
        'text-color': [
          'interpolate',
          ['linear'],
          [ "get", "Temperatur", ["object", ["get", "live"]]],
          -5, '#9900cc',
          0, '#0000ff',
          10, '#0099ff',
          20, '#ffff00',
          30, '#ff0000'
        ]
      },
      "layout": {
        "text-field": "",
        "text-variable-anchor": ["bottom"],
        "text-offset": [0,1],
        "text-size": 15
      } 
    }, 'base-layer');
  }
    
  setBaseLayerFilter(boxes){
    this.oldFilter = this.map.getFilter('base-layer');
    this.map.setFilter('base-layer', ["match", ["get", "_id"], boxes, true, false ]);
    this.map.setFilter('number-layer', ["match", ["get", "_id"], boxes, true, false ]);
  }
  
  resetBaseFilter(){
    this.map.setFilter('base-layer', this.oldFilter);
    this.map.setFilter('number-layer', this.oldFilter);
  }
  
  colorActives(colors, theme){
//     'match',
// ['get', 'ethnicity'],
// 'White',
// '#fbb03b',
// 'Black',
// '#223b53',
// 'Hispanic',
// '#e55e5e',
// 'Asian',
// '#3bb2d0',
    let colorArray = ['match', ['get', '_id']];
    colors.domain.forEach(domain => {
      colorArray.push(domain, colors.getColor(domain));
    });
    if(theme === 'dark'){
      colorArray.push('#FFFFFF')
    } else {
      colorArray.push('#383838')
    }
    console.log("COLORARRAY:" ,colorArray);
    this.map.setPaintProperty('active-layer-text', 'text-color', colorArray);
    // this.map.setPaintProperty('active-layer', 'circle-stroke-width', 2);
    // this.map.setPaintProperty('active-layer', 'cirlce-color', colorArray);
    // this.map.setPaintProperty('active-layer-text', 'text-halo-color', '#ccc')
  }
  
  setThemeLight(){
    this.boxService.setMapInit(false);
    this.boxService.setDataInit(false);
    this.uiService.updateBaseLayer(
      {
        'paint': {
          'circle-radius': {
              'base': 1.75,
              'stops': [[1, 2], [22, 3080]]
          },
          'circle-stroke-width': 1,
          'circle-blur': 0
      } 
    }
  );
  this.map.setPaintProperty('active-layer-text', 'text-color', '#383838');
  this.map.setPaintProperty('active-layer-text', 'text-halo-color', '#f6f6f6');

    // this.uiService.setLayers([
      //   {
        //     'id': 'base-layer',
        //     'type': 'circle',
        //     'source': 'boxes',
        //     'filter': ["!=", 'old', ["get", "state"]],
        //     'paint': {
          //     'circle-radius': {
            //       'base': 1.75,
            //       'stops': [[1, 2], [22, 3080]]
            //     },
            //     'circle-stroke-width': 1,
            //     'circle-stroke-color': '#383838',
            
            //     // 'circle-blur': 0.8,
            //     'circle-color': [
              //       'match',
              //       ['get', 'state'],
              //       'active', '#4EAF47',
              //       'old', '#eb5933',
              //       /* other */ '#ccc200'
              //       ]
              //     } 
              //   } 
              // ]);
              this.map.setStyle("mapbox://styles/mapbox/light-v9");
              // this.boxService.setMapInit(false);
              // this.map.once('style.load', () => {
                //   const waiting = () => {
                  //     if (!this.map.isStyleLoaded()) {
                    //       setTimeout(waiting, 200);
                    //     } else {
                      //       this.boxService.setMapInit(true);
                      //       setTimeout(waiting, 200);
                      //     }
                      //   };
                      //   waiting();
                      // });
                      
                    }
                    
                    setThemeDark(){
                      this.boxService.setMapInit(false);
                      this.boxService.setDataInit(false);
                      this.uiService.updateBaseLayer(
                          {
                            'paint': {
                              'circle-radius': {
                                  'base': 1.75,
                                  'stops': [[1, 2], [22, 3080]]
                              },
                              'circle-stroke-width': 0,
                              'circle-blur': 0.8,
                          } 
                        } 
                      );
                      this.map.setPaintProperty('active-layer-text', 'text-color', 'white');
                      this.map.setPaintProperty('active-layer-text', 'text-halo-color', '#383838');
    this.map.setStyle("mapbox://styles/mapbox/dark-v9");
    // this.boxService.setMapInit(false);
    // this.map.once('style.load', () => {
      //   const waiting = () => {
        //     if (!this.map.isStyleLoaded()) {
          //       setTimeout(waiting, 200);
          //     } else {
            //       // this.boxService.setMapInit(true);
            //       setTimeout(waiting, 200);
            //     }
            //   };
            //   waiting();
            // });
          }
        }
        