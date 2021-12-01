import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'osem-new-vis',
  templateUrl: './new-vis.component.html',
  styleUrls: ['./new-vis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewVisComponent implements OnInit {

  @Input() pheno;
  @Input() dateRange;
  @Input() date;
  @Input() filters;
  @Input() bbox;

  @Output() visSaved = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  saveVis(vis){
    this.visSaved.emit(vis);
  }
}
