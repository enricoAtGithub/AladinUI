import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManufacturerCodeComponent } from './manufacturer_code.component';


describe('ManufacturerCodeComponent', () => {
  let component: ManufacturerCodeComponent;
  let fixture: ComponentFixture<ManufacturerCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
