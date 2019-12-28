import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSwitcherComponent } from './filter-switcher.component';

describe('FilterSwitcherComponent', () => {
  let component: FilterSwitcherComponent;
  let fixture: ComponentFixture<FilterSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSwitcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
