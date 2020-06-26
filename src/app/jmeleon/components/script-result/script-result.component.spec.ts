import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptResultComponent } from './script-result.component';

describe('ScriptResultComponent', () => {
  let component: ScriptResultComponent;
  let fixture: ComponentFixture<ScriptResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
