import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSondageFeedbackComponent } from './admin-sondage-feedback.component';

describe('AdminSondageFeedbackComponent', () => {
  let component: AdminSondageFeedbackComponent;
  let fixture: ComponentFixture<AdminSondageFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSondageFeedbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSondageFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
