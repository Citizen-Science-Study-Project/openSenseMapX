import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { slideInOutMenu } from 'src/app/helper/animations';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { UiQuery } from '../../../../models/ui/state/ui.query';
import { MapService } from '../../../explore/services/map.service';

@Component({
  selector: 'osem-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  animations: [slideInOutMenu],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavRightComponent implements OnInit {

  @Output() themeToggled = new EventEmitter();
  @Output() languageToggled = new EventEmitter();
  @Output() settingsToggled = new EventEmitter();
  @Output() shareToggled = new EventEmitter();
  @Output() clusteringToggled = new EventEmitter();
  @Output() hideOutliersToggled = new EventEmitter();

  @Input() theme;
  @Input() language;
  @Input() settings;
  @Input() sharing;
  @Input() user;
  @Input() clustering;
  @Input() hideOutliers;


  baseURL = 'http://localhost:4200';
  URL = this.baseURL;

  constructor(private activatedRoute: ActivatedRoute, private uiQuery: UiQuery, private mapService: MapService) {
  }

  ngOnInit() {
  }

  toggleTheme(them) {
    if (them === 'light'){
      this.themeToggled.emit('dark');
    } else {
      this.themeToggled.emit('light');
    }
  }

  toggleLanguage(lang) {
    if (lang === 'de-DE'){
      this.languageToggled.emit('en-US');
    } else {
      this.languageToggled.emit('de-DE');
    }
  }

  toggleSettings() {
    this.settingsToggled.emit();
  }

  toggleShare() {
    this.shareToggled.emit();
  }

  toggleClustering() {
    this.clusteringToggled.emit();

    const element: any = document.getElementById('clustering');
    if (element) {
      element.checked = !this.clustering;
    }
  }

  toggleHideOutliers() {
    this.hideOutliersToggled.emit();

    const element: any = document.getElementById('hideOutliers');
    if (element) {
      element.checked = !this.hideOutliers;
    }
  }

  shareWebMap() {
    $('#share-vis-options-static').removeClass('active');
    $('#share-vis-options-gif').removeClass('active');
    $('#share-vis-options-link').addClass('active');

    this.activatedRoute.queryParams.subscribe(queryParams => {
      const bbox = this.mapService.map.getBounds().toArray();
      const paramsURL = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`);
      console.log(paramsURL);
      this.URL = `${this.baseURL}/share/${bbox.join()}?${paramsURL.join('&')}`;
      console.log('queryParams', this.URL);
    });

    this.mapService.map.on('movestart', () => {
      const bbox = this.mapService.map.getBounds().toArray();

      const queryParams = this.activatedRoute.snapshot.queryParams;
      const paramsURL = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`);
      console.log(paramsURL);
      this.URL = `${this.baseURL}/share/${bbox.join()}?${paramsURL.join('&')}`;
      console.log('getBounds', this.URL);
    });
  }

  shareStaticMap() {
    $('#share-vis-options-link').removeClass('active');
    $('#share-vis-options-gif').removeClass('active');
    $('#share-vis-options-static').addClass('active');

    $('#exportStaticMap').on('click', () => {
      let format;

      if ($('#png:checked').length != 0) {
        format = 'img';
      } else {
        format = 'pdf';
      }

      this.mapService.printMap(format);

      $('#static-share-buttons').addClass('active');
    });
  }

  shareGIF() {
    $('#share-vis-options-link').removeClass('active');
    $('#share-vis-options-static').removeClass('active');
    $('#share-vis-options-gif').addClass('active');
  }
}
