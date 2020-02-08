import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtefactListComponent } from './artefact-list.component';

describe('ArtefactListComponent', () => {
  let component: ArtefactListComponent;
  let fixture: ComponentFixture<ArtefactListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtefactListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtefactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
