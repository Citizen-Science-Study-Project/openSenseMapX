import { Injectable } from '@angular/core';
import { VisStore } from './vis.store';
import { Vis } from './vis.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SessionService } from '../../session/state/session.service';
import { UiService } from '../../ui/state/ui.service';
import { MapService } from 'src/app/modules/explore/services/map.service';
import { BoxService } from '../../box/state/box.service';
import '../../../helper/mapPrinter.js';


@Injectable({ providedIn: 'root' })
export class VisService {

  constructor(
    private visStore: VisStore,
    private sessionService: SessionService,
    private http: HttpClient,
    private uiService: UiService,
    private boxService: BoxService,
    private mapService: MapService) {
  }

  get() {
    return this.http.get<Vis[]>(`/assets/data/vis.json`).pipe(tap(entities => {
      this.visStore.set(entities);
    }));
  }

  createVis(vis) {
    console.log(vis);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + window.localStorage.getItem('sb_accesstoken'));

    return this.http.post(`${environment.api_url}/vis`, vis, { headers: headers }).subscribe(res => {
      console.log(res);
    })
  }

  getMyVis() {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + window.localStorage.getItem('sb_accesstoken'));

    this.http.get(`${environment.api_url}/users/me/vis`, { headers: headers }).subscribe((res: any) => {
      this.visStore.upsertMany(res.data.vis);
      this.sessionService.updateMyVis(res.data.vis.map(res => res._id));
    });
  }

  loadVis(vis) {
    // this.uiService.setSelectedDate(vis.date);
    this.uiService.setFilters(vis.filters);
    this.mapService.fitBounds(vis.bbox);
    this.uiService.updateSelectedPheno(vis.pheno);

    if (vis.dateRange) {
      let dateRange = [new Date(vis.dateRange[0]), new Date(vis.dateRange[1])]
      this.uiService.updateDateRange(dateRange);
      this.uiService.updateActiveTimeMode('timerange');
      this.boxService.getValues(vis.pheno.title, dateRange, vis.bbox).subscribe();
    }

    if (vis.date) {
      let date = new Date(vis.date);
      this.uiService.updateDateStamp(date);
      this.uiService.updateActiveTimeMode('timestamp');
      this.boxService.getValues(vis.pheno.title, [date, date], vis.bbox).subscribe();

    }
  }
}