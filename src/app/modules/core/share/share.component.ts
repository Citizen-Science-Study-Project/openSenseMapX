import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from 'src/app/models/ui/state/ui.service';
import { MapService } from '../../explore/services/map.service';


@Component({
  templateUrl: './share.component.html',
  selector: 'share-component'
})
export class ShareComponent implements OnInit {

  activeRouteSub;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mapService: MapService,
    private router: Router,
    private uiService: UiService) {
  }

  ngOnInit() {

    this.activeRouteSub = this.activatedRoute.params.subscribe(params => {
      console.log('bbox', params.bbox);

      if (params.bbox){
        const coords = (params.bbox).split(',', 4);
        const bbox = [[coords[0], coords[1]], [coords[2], coords[3]]];
        console.log('bbox array', bbox);
        // var bbox = [
        //   [32.958984, -5.353521], // southwestern corner of the bounds
        //   [43.50585, 5.615985] // northeastern corner of the bounds
        // ]
        this.mapService.fitBounds(bbox);
        // http://localhost:4200/share/13.5123939167743,52.53654639491532,13.613392628220424,52.58341402678505?mapPheno=Luftdruck
      } else {
      }
    });

  }

  ngOnDestroy() {
    this.activeRouteSub.unsubscribe();
  }
}
