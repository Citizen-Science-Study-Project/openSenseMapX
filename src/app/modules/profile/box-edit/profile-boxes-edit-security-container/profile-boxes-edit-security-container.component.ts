import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoxQuery } from 'src/app/models/box/state/box.query';
import { BoxService } from 'src/app/models/box/state/box.service';

@Component({
  selector: 'osem-profile-boxes-edit-security-container',
  templateUrl: './profile-boxes-edit-security-container.component.html',
  styleUrls: ['./profile-boxes-edit-security-container.component.scss']
})
export class ProfileBoxesEditSecurityContainerComponent implements OnInit {

  activeRouteSub;
  box$;


  constructor(    
    private boxQuery: BoxQuery,
    private boxService: BoxService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activeRouteSub = this.activatedRoute.parent.params.subscribe(params => {
      if(params.id){
        this.box$ = this.boxQuery.selectEntityWithSensor(params.id);
        console.log(this.box$)
      } else {
        this.box$ = undefined;
      }
    });
  }

  ngOnDestroy(){
    this.activeRouteSub.unsubscribe();
  }

  saveBox(box){
    this.boxService.saveBox(box);
  }

  generateNewToken(id){
    this.boxService.generateNewToken(id);
  }
}