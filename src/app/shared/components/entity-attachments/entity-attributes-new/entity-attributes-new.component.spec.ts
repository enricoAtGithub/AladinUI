import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityAttributesNewComponent } from './entity-attributes-new.component';

describe('EntityAttributesNewComponent', () => {
  let component: EntityAttributesNewComponent;
  let fixture: ComponentFixture<EntityAttributesNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityAttributesNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityAttributesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
