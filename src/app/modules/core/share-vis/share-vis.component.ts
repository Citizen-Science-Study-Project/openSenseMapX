import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MapService } from '../../explore/services/map.service';
import { UiQuery } from '../../../models/ui/state/ui.query';
import { ActivatedRoute } from '@angular/router';

import * as $ from 'jquery';
import * as saveAs from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    $('#share-vis-options-static').removeClass('active');
    $('#share-vis-options-gif').removeClass('active');
    $('#share-vis-options-link').addClass('active');

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

      this.printMap(format);

      $('#static-share-buttons').addClass('active');
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

    if ($('.stats-headline').length != 0) {
      mapLegend.children().children().children().children().children().last().remove(); //remove the statistics part from the legend
    } else {
      //Fix legend gradient bar
      let gradient = mapLegend.children().children().children().children().last();
      gradient.css('height', '100%');
      gradient.css('margin', '0');
    }

    let improveMapText = $('.mapbox-improve-map').first().text(); //save the improve map text

    hideMapElements(); //Hide elements from the map that should not be printed

    var legend = $('<div></div>'); //create a new div container for the legend
    legend.addClass('map-overlay'); //add a new mapbox overlay
    legend.append(mapLegend); //copy the existing legend to the new one
    legend.css('position', 'absolute'); //legend position
    legend.css('left', '0');
    legend.css('top', '0');
    legend.css('background', 'white'); //legend background color
    legend.css('opacity', '0.7'); //legend background opacity

    if ($('#legendSwitch:checked').length != 0) {
      mapContainer.append(legend); //add legend to map
    }
    //once the map is fully rendered
    renderMap.once('idle', () => {
      //convert the html container into a canvas element
      html2canvas(mapContainer[0]).then(function (canvas) {
        //save image (PNG)
        if (format == 'img') {
          console.log("Printing image ...");
          canvas.toBlob((blob) => {
            saveAs(blob, 'vis.png');
          });
        }
        //save PDF
        if (format == 'pdf') {
          console.log('Printing PDF...');
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
      $('.mapboxgl-ctrl-top-right').first().css('visibility', 'visible'); //restore map controls
      $('.mapbox-improve-map').first().text(improveMapText); //restore improve map text
      renderMap.setZoom(renderMap.getZoom()); //Fix to print multiple times for the same view
    }
  }
}