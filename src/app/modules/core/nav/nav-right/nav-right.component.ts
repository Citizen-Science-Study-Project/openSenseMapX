import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { slideInOutMenu } from 'src/app/helper/animations';

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

  constructor() {
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
}
