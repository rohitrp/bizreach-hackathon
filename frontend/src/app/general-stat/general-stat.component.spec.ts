import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralStatComponent } from './general-stat.component';

describe('GeneralStatComponent', () => {
  let component: GeneralStatComponent;
  let fixture: ComponentFixture<GeneralStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
