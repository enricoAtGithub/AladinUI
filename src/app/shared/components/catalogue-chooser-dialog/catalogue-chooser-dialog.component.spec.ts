import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueChooserDialogComponent } from './catalogue-chooser-dialog.component';

describe('CatalogueChooserDialogComponent', () => {
  let component: CatalogueChooserDialogComponent;
  let fixture: ComponentFixture<CatalogueChooserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueChooserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueChooserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
