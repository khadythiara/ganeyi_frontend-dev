import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourKpiComponent } from './hour-kpi.component';

describe('HourKpiComponent', () => {
  let component: HourKpiComponent;
  let fixture: ComponentFixture<HourKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HourKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HourKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
