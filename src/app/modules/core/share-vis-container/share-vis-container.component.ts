import { Component, OnInit } from '@angular/core';
import { UiQuery } from 'src/app/models/ui/state/ui.query';
import { VisService } from 'src/app/models/vis/state/vis.service';
import { MapService } from '../../explore/services/map.service';

@Component({
  selector: 'osem-share-vis-container',
  templateUrl: './share-vis-container.component.html',
  styleUrls: ['./share-vis-container.component.scss']
})
export class ShareVisContainerComponent implements OnInit {


  pheno$ = this.uiQuery.selectSelectedPheno$;
  dateRange$ = this.uiQuery.selectDateRange$;
  date$ = this.uiQuery.selectDateStamp$;
  filters$ = this.uiQuery.selectFilters$
  bbox;


  constructor(
    private visService: VisService,
    private uiQuery: UiQuery,
    private mapService: MapService) { }

  ngOnInit() {
    this.bbox = this.mapService.getBounds();
  }

  shareVis() {
    alert("shareVis method in share-vis-container");
  }

  sharePDF() {
    alert("sharePDF method in share-vis-container");
  }

  shareGIF() {
    alert("shareGIF method in share-vis-container");
  }
}
