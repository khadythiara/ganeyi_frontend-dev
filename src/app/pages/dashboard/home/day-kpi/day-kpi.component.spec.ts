import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayKpiComponent } from './day-kpi.component';

describe('DayKpiComponent', () => {
  let component: DayKpiComponent;
  let fixture: ComponentFixture<DayKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
