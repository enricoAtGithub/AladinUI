import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFileAttachmentsComponent } from './entity-file-attachments.component';

describe('EntityFileAttachmentsComponent', () => {
  let component: EntityFileAttachmentsComponent;
  let fixture: ComponentFixture<EntityFileAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityFileAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityFileAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
