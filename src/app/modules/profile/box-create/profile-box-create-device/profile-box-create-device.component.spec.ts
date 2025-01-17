import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileBoxCreateDeviceComponent } from './profile-box-create-device.component';

describe('ProfileBoxCreateDeviceComponent', () => {
  let component: ProfileBoxCreateDeviceComponent;
  let fixture: ComponentFixture<ProfileBoxCreateDeviceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileBoxCreateDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBoxCreateDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
