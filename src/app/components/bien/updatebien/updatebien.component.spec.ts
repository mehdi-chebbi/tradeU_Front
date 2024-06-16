import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatebienComponent } from './updatebien.component';

describe('UpdatebienComponent', () => {
  let component: UpdatebienComponent;
  let fixture: ComponentFixture<UpdatebienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatebienComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatebienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
