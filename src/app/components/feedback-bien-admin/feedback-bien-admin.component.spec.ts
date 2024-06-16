import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackBienAdminComponent } from './feedback-bien-admin.component';

describe('FeedbackBienAdminComponent', () => {
  let component: FeedbackBienAdminComponent;
  let fixture: ComponentFixture<FeedbackBienAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackBienAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackBienAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
