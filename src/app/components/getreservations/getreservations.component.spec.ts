import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetreservationsComponent } from './getreservations.component';

describe('GetreservationsComponent', () => {
  let component: GetreservationsComponent;
  let fixture: ComponentFixture<GetreservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetreservationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetreservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
