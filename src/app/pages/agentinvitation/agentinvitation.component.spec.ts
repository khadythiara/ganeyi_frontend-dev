import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentinvitationComponent } from './agentinvitation.component';

describe('AgentinvitationComponent', () => {
  let component: AgentinvitationComponent;
  let fixture: ComponentFixture<AgentinvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentinvitationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentinvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
