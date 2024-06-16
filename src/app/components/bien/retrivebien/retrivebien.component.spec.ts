import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrivebienComponent } from './retrivebien.component';

describe('RetrivebienComponent', () => {
  let component: RetrivebienComponent;
  let fixture: ComponentFixture<RetrivebienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrivebienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetrivebienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
