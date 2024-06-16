import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetplacesComponent } from './getplaces.component';

describe('GetplacesComponent', () => {
  let component: GetplacesComponent;
  let fixture: ComponentFixture<GetplacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetplacesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetplacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
