import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/models/ui/state/ui.service';
import { UiQuery } from 'src/app/models/ui/state/ui.query';

@Component({
  selector: 'osem-map-options-container',
  templateUrl: './map-options-container.component.html',
  styleUrls: ['./map-options-container.component.scss']
})
export class MapOptionsContainerComponent implements OnInit {

  layers = ['base-layer', 'boxes-cluster', 'no-cluster-number', 'cluster-label', 'boxes-no-cluster'];
  visible = false;

  clustering$ = this.uiQuery.selectClustering$;
  heatmap$ = this.uiQuery.selectHeatmap$;
  circles$ = this.uiQuery.selectCircles$;
  numbers$ = this.uiQuery.selectNumbers$;

  constructor(
    private uiService: UiService,
    private uiQuery: UiQuery) { }

  ngOnInit() {
  }

  toggleVisibility(){
    this.visible = !this.visible;
  }

  toggleClustering(){
    this.uiService.toggleClustering();
  }

  toggleHeatmap(){
    this.uiService.toggleHeatmap();
  }

  toggleCircles(){
    this.uiService.toggleCircles();
  }

  toggleNumbers(){
    this.uiService.toggleNumbers();
  }
}
