import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbienComponent } from './addbien.component';

describe('AddbienComponent', () => {
  let component: AddbienComponent;
  let fixture: ComponentFixture<AddbienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddbienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddbienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
