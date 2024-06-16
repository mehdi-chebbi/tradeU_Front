import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiqueSondageComponent } from './statistique-sondage.component';

describe('StatistiqueSondageComponent', () => {
  let component: StatistiqueSondageComponent;
  let fixture: ComponentFixture<StatistiqueSondageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatistiqueSondageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiqueSondageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
