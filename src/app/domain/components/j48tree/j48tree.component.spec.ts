import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { J48TreeComponent } from './j48tree.component';

describe('FinComponent', () => {
  let component: J48TreeComponent;
  let fixture: ComponentFixture<J48TreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ J48TreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(J48TreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
