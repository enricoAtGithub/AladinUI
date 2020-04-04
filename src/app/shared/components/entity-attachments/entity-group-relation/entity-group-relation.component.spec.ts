import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityGroupRelationComponent } from './entity-group-relation.component';

describe('EntityGroupRelationComponent', () => {
  let component: EntityGroupRelationComponent;
  let fixture: ComponentFixture<EntityGroupRelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityGroupRelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityGroupRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
