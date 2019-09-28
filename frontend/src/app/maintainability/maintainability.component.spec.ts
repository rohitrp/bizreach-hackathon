import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainabilityComponent } from './maintainability.component';

describe('MaintainabilityComponent', () => {
  let component: MaintainabilityComponent;
  let fixture: ComponentFixture<MaintainabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
