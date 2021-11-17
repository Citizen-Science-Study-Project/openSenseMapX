import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BoxStore } from './box.store';
import { Box } from './box.model';
import { tap, share } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';

import { schema } from 'normalizr';
import { SensorStore } from '../../sensor/state/sensor.store';
import { UiService } from '../../ui/state/ui.service';
import { BoxQuery } from './box.query';
import { processBoxData, toGeoJson } from 'src/app/modules/explore/box/osem-line-chart/helper/helpers';

@Injectable({ providedIn: 'root' })
export class BoxService {

  popupBoxTimeout;
  AUTH_API_URL = environment.api_url;


  constructor(
    private boxStore: BoxStore,
    private sensorStore: SensorStore,
    private boxQuery: BoxQuery,
    private uiService: UiService,
    private http: HttpClient) {
  }

  //DEPRECATED: Used to fetch boxes from the api and load to store. Because of perfomance issues the data is loaded directly as GEOJSON into mapbox now.
  get() {

    // Normalizr-Schema for the Data
    const sensor = new schema.Entity('sensors', {}, { idAttribute: '_id' });
    const box = new schema.Entity('boxes', {sensors: [sensor] }, { idAttribute: '_id' });


    // return this.http.get<Box[]>(`${environment.api_url}/boxes?classify=true&full=true`).pipe(tap(entities => {
    return this.http.get<Box[]>(`${environment.api_url}/boxes?classify=true&bbox=13.0882097323,52.3418234221,13.7606105539,52.6697240587&full=true`).pipe(tap(entities => {
    // return this.http.get<Box[]>(`${environment.api_url}/boxes?classify=true&bbox=5.98865807458,47.3024876979,15.0169958839,54.983104153&full=true`).pipe(tap(entities => {
    // return this.http.get<Box[]>(`${environment.api_url}/boxes?classify=true&full=true`).pipe(tap(entities => {
    // return this.http.get<any>(`/assets/data/start-data.json`).pipe(tap(entities => {

      // this.boxStore.set(entities);
      let ownNormalize = processBoxData(entities);
      // // //set Data in stores
      this.boxStore.set(ownNormalize[0]);
      //TODO: find better way than this (reference from sensor to box)
      // for (let box in res.entities.boxes) {
      //   res.entities.boxes[box].sensors.forEach(sensor => {
      //     // debugger
      //     res.entities.sensors[sensor].boxes_id = res.entities.boxes[box]._id;
      //     res.entities.sensors[sensor].boxes_name = res.entities.boxes[box].name;
      //   })
      // }
      this.sensorStore.set(ownNormalize[1]);
    }));
  }

  // Function to fetch daterange-Data from the opensensemap API.
  getValues(pheno, dateRange, bbox) {

    this.boxStore.setFetchingData(true);

    const bboxString  = `${bbox[0][0]},${bbox[0][1]},${bbox[1][0]},${bbox[1][1]}`;


    return this.http.get<any[]>(`${environment.api_url}/statistics/descriptive?&phenomenon=${pheno}&bbox=${bboxString}&format=json&columns=boxId,lat,lon,boxName,exposure&from-date=${dateRange[0].toISOString()}&to-date=${dateRange[1].toISOString()}&window=3600000&operation=arithmeticMean`).pipe(tap(entities => {
      entities = entities.map(ent => {
        let { boxId, sensorId, boxName, exposure,lat, lon, ...noEnt} = ent;
        //TODO: find better place for vconverting to 2 decimal-diggits
        Object.keys(noEnt).forEach(key => {if(noEnt[key]) { noEnt[key] = Math.round( noEnt[key] * 1e2 ) / 1e2 } })
        return {
          _id: ent.boxId,
          name: ent.boxName,
          exposure: ent.exposure,
          lat: ent.lat,
          lon: ent.lon,
          sensors: [
            {_id: sensorId, title: pheno}
          ],
          values: {
            [pheno]: noEnt
          }
        }
      })
      this.boxStore.setDateRangeData(toGeoJson(entities))
      // this.boxStore.upsertMany(entities);

      let ownNormalize = processBoxData(entities);
      this.boxStore.upsertMany(ownNormalize[0]);
      this.sensorStore.upsertMany(ownNormalize[1]);


      this.boxStore.setDataFetched(true);
      this.boxStore.setFetchingData(false);
      //TODO: find a better place for this + fix calling twice :o
      this.uiService.setSelectedDate(dateRange[0]);
      this.uiService.setSelectedDate(dateRange[0]);
      this.uiService.setFilterVisible(false);
      // console.log(toGeoJson(this.boxStore.getValue()))
      // this.uiService.setReloadMapData(true);
    }), share());
  }

  // Fetches the data for one box
  getSingleBox(id){

    return this.http.get<Box>(`${environment.api_url}/boxes/${id}`).pipe(tap(entity => {
      let ownNormalize = processBoxData([entity]);
      this.boxStore.upsertMany(ownNormalize[0]);
      this.sensorStore.upsertMany(ownNormalize[1]);

      // let entities: any = normalize([entity], [box]);
      // this.boxStore.upsert(entities.entities.boxes[entity._id], entities.entities.boxes);
      // this.sensorStore.upsertMany(Object.values(entities.entities.sensors));
    }));
  }

  // Fetches all the boxes of one user
  getMyBoxes(){
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));

    this.http.get(this.AUTH_API_URL + '/users/me/boxes', {headers: headers}).subscribe((res:any) => {
      let ownNormalize = processBoxData(res.data.boxes);
      this.boxStore.upsertMany(ownNormalize[0]);
      this.sensorStore.upsertMany(ownNormalize[1]);
    });
  }

  add(box: Box) {
    this.boxStore.add(box);
  }

  setActive(id) {
    if(id)
      this.getSingleBox(id).subscribe();
    this.boxStore.setActive(id);
  }

  update(id, box: Partial<Box>) {
    this.boxStore.update(id, box);
  }

  remove(id: ID) {
    this.boxStore.remove(id);
  }

  setDisplayTimeSlider(display: boolean){
    this.boxStore.updateDisplayTimeSlider(display);
  }

  setMapInit(mapInit){
    this.boxStore.setMapInit(mapInit);
  }
  setDataInit(dataInit){
    this.boxStore.setDataInit(dataInit);
  }

  setCompareModus(modus){
    this.boxStore.setCompareModus(modus);
  }

  toggleCompareTo(box){
    this.getSingleBox(box).subscribe();
    this.boxStore.toggleCompareTo(box);
  }
  resetCompareTo(){
    this.boxStore.resetCompareTo();
  }

  setCompareTo(compareTo){
    this.boxStore.setCompareTo(compareTo);
    compareTo.forEach(compare => {
      this.getSingleBox(compare).subscribe();
    })
  }

  setDateRangeData(data){
    this.boxStore.setDateRangeData(data);
  }

  setPopupBox(box){
    if(!box){
      clearTimeout(this.popupBoxTimeout);
      this.popupBoxTimeout = setTimeout(() => {
        this.boxStore.setPopupBox(box);
      }, 250)
    } else {
      clearTimeout(this.popupBoxTimeout);
      this.boxStore.setPopupBox(box);
    }
  }

  setDataFetched(dataFetched){
    this.boxStore.setDataFetched(dataFetched);
  }

  setFetchingData(fetchingData){
    this.boxStore.setFetchingData(fetchingData);
  }

}
