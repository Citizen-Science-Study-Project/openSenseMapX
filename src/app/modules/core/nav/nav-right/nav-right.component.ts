import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { slideInOutMenu } from 'src/app/helper/animations';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { UiQuery } from '../../../../models/ui/state/ui.query';
import { MapService } from '../../../explore/services/map.service';
import * as saveAs from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

    $('#button-export-static').on('click', () => {
      let format;

      if ($('#radio-format-png:checked').length != 0) {
        format = 'png';
      } else {
        format = 'pdf';
      }

      this.printMap(format);
    });
  }

  shareGIF() {
    $('#share-vis-options-link').removeClass('active');
    $('#share-vis-options-static').removeClass('active');
    $('#share-vis-options-gif').addClass('active');
  }

  printMap(format) {
    let renderMap = this.mapService.map; //make a copy of the map
    let mapContainer = $('#map'); //get the map's container
    let mapLegend = $('#legend').clone(true); //clone the map legend
    let dateString = $('.datetime-flex').first().clone(true); //clone the date string of the filter menu
    let mapLogo = $('.logo').first().clone(true); //clone the OSM logo
    let phenoName = $('.pheno-name').first().clone(true);

    //Remove the statistics part from the legend for active boxes layer
    if ($('.stats-headline').length != 0) {
      mapLegend.children().children().children().children().children().last().remove();
    } else {
      //Fix legend gradient bar for phenomena
      let gradient = mapLegend.children().children().children().children().last();
      gradient.css('height', '100%');
      gradient.css('margin', '0');
    }

    let improveMapText = $('.mapbox-improve-map').first().text(); //save the improve map text

    hideMapElements(); //Hide elements from the map that should not be printed

    var legend = $('<div></div>'); //create a new div container for the legend
    legend.addClass('map-overlay'); //add a new mapbox overlay
    legend.addClass('osem-padding'); //add padding
    legend.append(phenoName); //add active phenomenon
    legend.append(mapLegend); //copy the existing legend to the new one
    legend.css('position', 'absolute'); //legend position
    legend.css('left', '2.5%');
    legend.css('top', '2.5%');
    legend.css('background', 'white'); //legend background color
    legend.css('opacity', '0.7'); //legend background opacity
    legend.css('font-size', '1.5em');
    legend.css('border-radius', '25px'); //rounded corners

    if ($('#radio-legend-yes:checked').length != 0) {
      mapContainer.append(legend); //add legend to map
    }

    var datetime = $('<div></div>'); //create a new div container for the datetime
    datetime.addClass('map-overlay'); //add a new mapbox overlay
    datetime.addClass('osem-padding'); //add padding
    datetime.append(dateString); //copy the existing datetime to the new one
    datetime.css('position', 'absolute'); //datetime position
    datetime.css('left', '37.5%');
    datetime.css('top', '2.5%');
    datetime.css('background', 'green'); //datetime background color
    datetime.css('color', 'white'); //text color
    datetime.css('opacity', '0.7'); //datetime background opacity
    datetime.css('font-size', '1.5em');
    datetime.css('border-radius', '25px'); //rounded corners
    mapContainer.append(datetime);

    var logo = $('<div></div>'); //create a new div container for the logo
    logo.addClass('map-overlay'); //add a new mapbox overlay
    logo.addClass('osem-padding'); //add padding
    logo.append(mapLogo); //copy the existing logo to the new one
    logo.css('position', 'absolute'); //logo position
    logo.css('right', '2.5%');
    logo.css('top', '2.5%');
    logo.css('opacity', '0.7'); //logo background opacity
    mapContainer.append(logo);

    //once the map is fully rendered
    renderMap.once('idle', () => {
      //convert the html container into a canvas element
      html2canvas(mapContainer[0]).then(function (canvas) {
        //save image (PNG)
        if (format == 'png') {
          //console.log("Printing image ...");
          canvas.toBlob((blob) => {
            saveAs(blob, 'vis.png');
          });
        }
        //save PDF
        if (format == 'pdf') {
          //console.log('Printing PDF...');
          const contentDataURL = canvas.toDataURL('image/png');
          let imgWidth = 297;
          let imgHeight = canvas.height * imgWidth / canvas.width;
          let pdf = new jsPDF('l', 'mm', 'a4');
          let position = 0;
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
          pdf.save('vis.pdf');
        }
      });
      restoreMap(); //restore the map defaults
    });
    renderMap.setZoom(renderMap.getZoom()); //Fix to trigger the map's idle event

    function hideMapElements() {
      $('.mapboxgl-ctrl-top-right').first().css('visibility', 'hidden'); //hide map controls
      $('.mapbox-improve-map').first().text(''); //hide improve map text
    }

    function restoreMap() {
      legend.remove(); //remove legend from the map
      datetime.remove();
      logo.remove();
      $('.mapboxgl-ctrl-top-right').first().css('visibility', 'visible'); //restore map controls
      $('.mapbox-improve-map').first().text(improveMapText); //restore improve map text
      renderMap.setZoom(renderMap.getZoom()); //Fix to print multiple times for the same view
    }
  }
}
