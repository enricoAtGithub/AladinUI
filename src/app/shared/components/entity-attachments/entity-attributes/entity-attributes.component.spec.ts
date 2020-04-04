import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityAttributesComponent } from './entity-attributes.component';

describe('EntityAttributesComponent', () => {
  let component: EntityAttributesComponent;
  let fixture: ComponentFixture<EntityAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
