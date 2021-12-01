import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';

export interface FormsState {
  visForm: {
    name: string;
    desc: string;
    exposure: string;
    bbox: string[];
  };
}

@Component({
  selector: 'osem-vis-form',
  templateUrl: './vis-form.component.html',
  styleUrls: ['./vis-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisFormComponent implements OnInit {


  @Input() bbox;
  @Input() filters;
  @Input() date;
  @Input() dateRange;
  @Input() pheno;
  @Input() exposure;

  @Output() visSaved = new EventEmitter();

  visForm;

  constructor(
    private formsManager: AkitaNgFormsManager<FormsState>,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    //console.log(this);
    this.visForm = this.builder.group({
      name: [null, Validators.required],
      // exposure: ['outdoor', Validators.required],
      desc: [null],
      // bbox: [this.bbox]
    }); 
    this.formsManager.upsert('visForm', this.visForm);
  }

  saveVis(){
    this.visSaved.emit({
      name: this.visForm.getRawValue().name,
      desc: this.visForm.getRawValue().desc,
      filters: this.filters,
      date: this.date,
      dateRange: this.dateRange,
      pheno: this.pheno,
      bbox: this.bbox,
    })
  }

}
