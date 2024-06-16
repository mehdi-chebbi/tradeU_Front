import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSondageFormComponent } from './add-sondage-form.component';

describe('AddSondageFormComponent', () => {
  let component: AddSondageFormComponent;
  let fixture: ComponentFixture<AddSondageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSondageFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSondageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
