import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightActionsEditorComponent } from './right-actions-editor.component';

describe('RightActionsEditorComponent', () => {
  let component: RightActionsEditorComponent;
  let fixture: ComponentFixture<RightActionsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightActionsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightActionsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
