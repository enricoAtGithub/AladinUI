import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityAttributegroupComponent } from './entity-attributegroup.component';

describe('EntityAttributegroupComponent', () => {
  let component: EntityAttributegroupComponent;
  let fixture: ComponentFixture<EntityAttributegroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityAttributegroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityAttributegroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
