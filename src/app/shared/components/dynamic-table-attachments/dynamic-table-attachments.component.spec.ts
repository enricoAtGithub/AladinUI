import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableAttachmentsComponent } from './dynamic-table-attachments.component';

describe('DynamicTableAttachmentsComponent', () => {
  let component: DynamicTableAttachmentsComponent;
  let fixture: ComponentFixture<DynamicTableAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicTableAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTableAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
