import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DTOEntitiesComponent } from './dto-entities.component';

describe('DTOEntitiesComponent', () => {
  let component: DTOEntitiesComponent;
  let fixture: ComponentFixture<DTOEntitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DTOEntitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DTOEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
