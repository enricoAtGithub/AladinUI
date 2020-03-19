import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAreaComponent } from './base-area.component';

describe('BaseAreaComponent', () => {
  let component: BaseAreaComponent;
  let fixture: ComponentFixture<BaseAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
