import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { UiQuery } from 'src/app/models/ui/state/ui.query';
import { UiService } from 'src/app/models/ui/state/ui.service';
import { Router, ActivatedRoute } from '@angular/router';
import { withLatestFrom } from 'rxjs/operators';
import { IntervalTimer } from '../../../../helper/IntervalTimer';
import { BoxQuery } from 'src/app/models/box/state/box.query';
import { TranslateService } from '@ngx-translate/core';
import { MapService } from '../../services/map.service';
import { BoxService } from 'src/app/models/box/state/box.service';

@Component({
  selector: 'osem-time-slider-container',
  templateUrl: './time-slider-container.component.html',
  styleUrls: ['./time-slider-container.component.scss']
})
export class TimeSliderContainerComponent implements OnInit {

  dateRange$ = this.uiQuery.selectDateRange$;
  dateRange;
  selectedDate$ = this.uiQuery.selectSelectedDate$;
  selectedPheno$ = this.uiQuery.selectSelectedPheno$;
  filterVisible$ = this.uiQuery.selectFilterVisible$;
  activeTimeMode$ = this.uiQuery.selectActiveTimeMode$;
  dateStamp$ = this.uiQuery.selectDateStamp$;
  loadingBoxes$ = this.boxQuery.selectFetchingData$;
  boxes$ = this.boxQuery.selectBoxes();
  dataFetched$ = this.boxQuery.selectDataFetched$;
  clustering$ = this.uiQuery.selectClustering$;
  selectedDate;
  selectedPheno;
  clustering;

  combineSub;

  step = 3600000;
  interval;
  intervalPlaying = false;

  constructor(
    private uiQuery: UiQuery,
    private uiService: UiService,
    private boxQuery: BoxQuery,
    private boxService: BoxService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mapService: MapService
    ) { }

  ngOnInit() {
    this.combineSub = this.selectedDate$.pipe(withLatestFrom(this.selectedPheno$, this.clustering$)).subscribe(res => {
        if(res[0]){
          this.selectedDate = res[0].getTime();
          this.uiService.setClustering(false);
        }
        if(res[1])
          this.selectedPheno = res[1];

        if(res[0] && res[1]){
          let newLayer = JSON.parse(JSON.stringify(res[1].layer));
          newLayer.filter = ["!=", null, [ "get", res[0].toISOString(), ["object", ["get", res[1].title, ["object", ["get", "values"]]]]]];
          newLayer.paint['circle-color'][2] = [ "get", res[0].toISOString(), ["object", ["get", res[1].title, ["object", ["get", "values"]]]]];
          this.uiService.updateBaseLayer(newLayer);
        } else if(res[1] && !res[0] && this.selectedDate) {
          let newLayer = JSON.parse(JSON.stringify(res[1].layer));
          // newLayer.filter = [ "get", res[1].title, ["object", ["get", "live", ["object", ["get", "sensors"]]]]];
          newLayer.filter = [ "get", "value", ["object", ["get", res[1].title, ["object", ["get", "live", ["object", ["get", "sensors"]]]]]]];
          // newLayer.paint['circle-color'][2] = [ "get", res[1].title, ["object", ["get", "live", ["object", ["get", "sensors"]]]]];
          newLayer.paint['circle-color'][2] = [ "get", "value", ["object", ["get", res[1].title, ["object", ["get", "live", ["object", ["get", "sensors"]]]]]]];
          console.log(newLayer);
          this.uiService.updateBaseLayer(newLayer);
          // this.uiService.setClustering(true);  TODO: what was this needed for?
        }
    })


    this.dateRange$.subscribe(res => {
      this.interval = null;
      this.dateRange = res;
    })
  }

  ngOnDestroy(){
    // this.mapService.removeDateLayer(new Date(this.selectedDate).toISOString());
    this.combineSub.unsubscribe();
  }

  dateSelected(date) {
    this.uiService.setSelectedDate(date);
  }

  removeDateRange(){
    console.log("removing date and daterange")
    const { fromDate, toDate, ...newQueryParams} = this.activatedRoute.snapshot.queryParams;
    this.uiService.updateDateRange(null);
    this.uiService.updateDateStamp(null);
    this.boxService.setDateRangeData(null);
    this.uiService.setSelectedDate(null);
    this.uiService.updateActiveTimeMode('live');
    // this.mapService.reactivateBaseLayer();
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: newQueryParams
      }
    );
  }

  play(){
    this.intervalPlaying = true;

    if(this.interval){
      this.interval.resume();
      return;
    }
    let numSteps =  (this.dateRange[1].getTime() -this.dateRange[0].getTime())/this.step;
    this.interval = new IntervalTimer('timeSlider', this.forward, 2500, numSteps, this);
    this.interval.start();
  }

  pause(){
    this.intervalPlaying = false;
    this.interval.pause();
  }

  backward(){
    this.uiService.setSelectedDate(new Date(this.selectedDate - this.step));
  }
  forward(that){
    that.uiService.setSelectedDate(new Date(that.selectedDate + that.step));
  }

  loadData(params){
    this.boxService.getValues(params[0], params[1], this.mapService.getBounds()).subscribe();
  }

}
