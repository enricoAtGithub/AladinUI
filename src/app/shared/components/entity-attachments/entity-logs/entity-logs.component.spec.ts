import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityLogsComponent } from './entity-logs.component';

describe('EntityLogsComponent', () => {
  let component: EntityLogsComponent;
  let fixture: ComponentFixture<EntityLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
