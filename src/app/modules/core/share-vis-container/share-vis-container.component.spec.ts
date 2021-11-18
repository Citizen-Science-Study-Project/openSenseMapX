import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareVisContainerComponent } from './share-vis-container.component';

describe('ShareVisContainerComponent', () => {
  let component: ShareVisContainerComponent;
  let fixture: ComponentFixture<ShareVisContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareVisContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareVisContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
