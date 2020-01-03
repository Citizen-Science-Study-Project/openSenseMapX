import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMapContainerComponent } from './map/base-map-container/base-map-container.component';
import { BaseMapComponent } from './map/base-map/base-map.component';
import { MapService } from './services/map.service';
import { BoxContainerComponent } from './box/box-container/box-container.component';
import { BoxValuesComponent } from './box/box-values/box-values.component';
import { BoxChartComponent } from './box/box-chart/box-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LegendContainerComponent } from './legend/legend-container/legend-container.component';
import { LegendComponent } from './legend/legend/legend.component';
import { TimeSliderContainerComponent } from './timeSlider/time-slider-container/time-slider-container.component';
import { TimeSliderComponent } from './timeSlider/time-slider/time-slider.component';
import { FormsModule } from '@angular/forms';
import { OsemLineChartComponent } from './box/osem-line-chart/osem-line-chart.component';
import { OsemLineSeriesComponent } from './box/osem-line-chart/osem-line-series/osem-line-series.component';
import { BoxSingleContainerComponent } from './box/box-single-container/box-single-container.component';
import { BoxSingleValuesComponent } from './box/box-single-values/box-single-values.component';
import { BoxCompareContainerComponent } from './box/box-compare-container/box-compare-container.component';
import { BoxCompareValuesComponent } from './box/box-compare-values/box-compare-values.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PopupComponent } from './map/popup/popup.component';
import { PopupContainerComponent } from './map/popup-container/popup-container.component';


@NgModule({
  declarations: [BaseMapContainerComponent, BaseMapComponent, BoxContainerComponent, BoxValuesComponent, BoxChartComponent, LegendContainerComponent, LegendComponent, TimeSliderContainerComponent, TimeSliderComponent, OsemLineChartComponent, OsemLineSeriesComponent, BoxSingleContainerComponent, BoxSingleValuesComponent, BoxCompareContainerComponent, BoxCompareValuesComponent, PopupComponent, PopupContainerComponent],
  imports: [
    CommonModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    TranslateModule
  ],
  providers: [MapService],
  exports: [BaseMapContainerComponent, LegendContainerComponent, TimeSliderContainerComponent]
})
export class ExploreModule { }
