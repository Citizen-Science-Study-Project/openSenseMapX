import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'osem-share-vis',
  templateUrl: './share-vis.component.html',
  styleUrls: ['./share-vis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareVisComponent implements OnInit {

  @Output() visShared = new EventEmitter();
  @Output() imgShared = new EventEmitter();
  @Output() pdfShared = new EventEmitter();
  @Output() gifShared = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  shareVis() {
    this.visShared.emit();
  }

  shareImage() {
    this.imgShared.emit();
  }

  sharePDF() {
    this.pdfShared.emit();
  }

  shareGIF() {
    this.gifShared.emit();
  }
}
