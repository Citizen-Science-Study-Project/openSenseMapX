import { Component, OnInit } from '@angular/core';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';

export interface FormsState {
  general: {
    name: string;
    desc: string;
    exposure: string;
    tags: string[];
  };
}


@Component({
  selector: 'osem-profile-box-create-general',
  templateUrl: './profile-box-create-general.component.html',
  styleUrls: ['./profile-box-create-general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileBoxCreateGeneralComponent implements OnInit {

  generalForm;

  constructor(
    private formsManager: AkitaNgFormsManager<FormsState>,
    private builder: FormBuilder) { }

  ngOnInit() {

    this.generalForm = this.builder.group({
      name: [null, Validators.required],
      exposure: ['outdoor', Validators.required],
      desc: [null],
      tags: [null]
    });
    this.formsManager.upsert('general', this.generalForm);
  }

}
