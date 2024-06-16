import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrivebienadminComponent } from './retrivebienadmin.component';

describe('RetrivebienadminComponent', () => {
  let component: RetrivebienadminComponent;
  let fixture: ComponentFixture<RetrivebienadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrivebienadminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetrivebienadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
