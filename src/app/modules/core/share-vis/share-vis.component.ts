import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapService } from '../../explore/services/map.service';
import { UiQuery } from '../../../models/ui/state/ui.query';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'osem-share-vis',
  templateUrl: './share-vis.component.html',
  styleUrls: ['./share-vis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareVisComponent implements OnInit {

  baseURL = 'http://localhost:4200';
  URL = this.baseURL;

  @Output() visShared = new EventEmitter();
  @Output() staticMapShared = new EventEmitter();
  @Output() gifShared = new EventEmitter();

  constructor(private activatedRoute: ActivatedRoute, private uiQuery: UiQuery, private mapService: MapService) {
  }

  ngOnInit() {
  }

  shareWebMap() {
    const bbox = this.mapService.getBounds();
    console.log('BBOX', bbox);
    console.log('BBOX STRING', bbox.join());

    const queryParams = this.activatedRoute.snapshot.queryParams;
    const paramsURL = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`);
    console.log(paramsURL);

    this.URL = `${this.baseURL}/share/${bbox.join()}?${paramsURL.join('&')}`;
    // http://localhost:4200/share/13.5123939167743,52.53654639491532,13.613392628220424,52.58341402678505?mapPheno=Luftdruck
    console.log('URL', this.URL);
  }

  shareStaticMap() {
    this.staticMapShared.emit();
  }

  shareGIF() {
    this.gifShared.emit();
  }
}
