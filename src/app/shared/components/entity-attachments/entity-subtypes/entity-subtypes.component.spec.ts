import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitySubtypesComponent } from './entity-subtypes.component';

describe('EntitySubtypesComponent', () => {
  let component: EntitySubtypesComponent;
  let fixture: ComponentFixture<EntitySubtypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitySubtypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitySubtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
