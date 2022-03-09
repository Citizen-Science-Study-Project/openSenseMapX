import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

  optionsContainerWeb;
  optionsContainerStatic;
  optionsContainerDynamic;

  constructor(private activatedRoute: ActivatedRoute, private uiQuery: UiQuery, private mapService: MapService) {
  }

  ngOnInit() {
    this.optionsContainerWeb = $('#share-vis-options-web');
    this.optionsContainerStatic = $('#share-vis-options-static');
    this.optionsContainerDynamic = $('#share-vis-options-dynamic');
  }

  shareWebMap() {
    this.optionsContainerStatic.removeClass('active');
    this.optionsContainerDynamic.removeClass('active');
    this.optionsContainerWeb.addClass('active');

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
    this.optionsContainerWeb.removeClass('active');
    this.optionsContainerDynamic.removeClass('active');
    this.optionsContainerStatic.addClass('active');

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

  shareDynamicMap() {
    this.optionsContainerWeb.removeClass('active');
    this.optionsContainerStatic.removeClass('active');
    this.optionsContainerDynamic.addClass('active');

    $('#button-export-dynamic').on('click', () => {
      console.log(this.mapService.testfunction());
    });
  }

  printMap(format) {
    let renderMap = this.mapService.map; //make a copy of the map
    let mapContainer = $('#map'); //get the map's container
    let mapLegend = $('#legend').clone(true); //clone the map legend

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
    legend.append(mapLegend); //copy the existing legend to the new one
    legend.css('position', 'absolute'); //legend position
    legend.css('left', '0');
    legend.css('top', '0');
    legend.css('background', 'white'); //legend background color
    legend.css('opacity', '0.7'); //legend background opacity

    if ($('#radio-legend-yes:checked').length != 0) {
      mapContainer.append(legend); //add legend to map
    }
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
      $('.mapboxgl-ctrl-top-right').first().css('visibility', 'visible'); //restore map controls
      $('.mapbox-improve-map').first().text(improveMapText); //restore improve map text
      renderMap.setZoom(renderMap.getZoom()); //Fix to print multiple times for the same view
    }
  }
}