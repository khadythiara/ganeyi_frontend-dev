import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxplotKpiComponent } from './boxplot-kpi.component';

describe('BoxplotKpiComponent', () => {
  let component: BoxplotKpiComponent;
  let fixture: ComponentFixture<BoxplotKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxplotKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxplotKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
