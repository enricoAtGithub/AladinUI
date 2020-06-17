import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptActionsComponent } from './script-actions.component';

describe('ScriptActionsComponent', () => {
  let component: ScriptActionsComponent;
  let fixture: ComponentFixture<ScriptActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
