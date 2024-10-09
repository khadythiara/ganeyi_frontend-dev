import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthKpiComponent } from './month-kpi.component';

describe('MonthKpiComponent', () => {
  let component: MonthKpiComponent;
  let fixture: ComponentFixture<MonthKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
