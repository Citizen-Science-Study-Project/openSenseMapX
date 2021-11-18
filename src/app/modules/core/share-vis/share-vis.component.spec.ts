import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareVisComponent } from './share-vis.component';

describe('ShareVisComponent', () => {
  let component: ShareVisComponent;
  let fixture: ComponentFixture<ShareVisComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareVisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareVisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
