import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTestComponent } from './entity-test.component';

describe('EntityTestComponent', () => {
  let component: EntityTestComponent;
  let fixture: ComponentFixture<EntityTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
