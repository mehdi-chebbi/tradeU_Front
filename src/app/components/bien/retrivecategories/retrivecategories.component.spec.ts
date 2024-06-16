import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrivecategoriesComponent } from './retrivecategories.component';

describe('RetrivecategoriesComponent', () => {
  let component: RetrivecategoriesComponent;
  let fixture: ComponentFixture<RetrivecategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrivecategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetrivecategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
