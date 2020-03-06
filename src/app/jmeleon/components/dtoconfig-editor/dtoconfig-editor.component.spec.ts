import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DTOConfigEditorComponent } from './dtoconfig-editor.component';

describe('DTOConfigEditorComponent', () => {
  let component: DTOConfigEditorComponent;
  let fixture: ComponentFixture<DTOConfigEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DTOConfigEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DTOConfigEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
