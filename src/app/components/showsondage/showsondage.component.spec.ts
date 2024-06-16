import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowsondageComponent } from './showsondage.component';

describe('ShowsondageComponent', () => {
  let component: ShowsondageComponent;
  let fixture: ComponentFixture<ShowsondageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowsondageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowsondageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
