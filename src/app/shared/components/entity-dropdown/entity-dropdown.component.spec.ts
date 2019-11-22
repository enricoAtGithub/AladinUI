import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDropdownComponent } from './entity-dropdown.component';

describe('EntityDropdownComponent', () => {
  let component: EntityDropdownComponent;
  let fixture: ComponentFixture<EntityDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
