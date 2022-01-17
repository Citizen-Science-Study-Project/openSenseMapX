import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'osem-share-vis',
  templateUrl: './share-vis.component.html',
  styleUrls: ['./share-vis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareVisComponent implements OnInit {

  @Output() visShared = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  shareVis() {
    this.visShared.emit();
  }
}
