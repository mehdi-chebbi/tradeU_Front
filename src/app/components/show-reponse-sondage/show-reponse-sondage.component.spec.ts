import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowReponseSondageComponent } from './show-reponse-sondage.component';

describe('ShowReponseSondageComponent', () => {
  let component: ShowReponseSondageComponent;
  let fixture: ComponentFixture<ShowReponseSondageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowReponseSondageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowReponseSondageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
