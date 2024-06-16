import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePlaceComponent } from './updateplace.component';

describe('UpdateplaceComponent', () => {
  let component: UpdatePlaceComponent;
  let fixture: ComponentFixture<UpdatePlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePlaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
