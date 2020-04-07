import { TestBed } from '@angular/core/testing';
import { JmeleonActionsForRightService } from './jmeleon-actions-for-right.service';


describe('JmeleonActionsForRoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JmeleonActionsForRightService = TestBed.get(JmeleonActionsForRightService);
    expect(service).toBeTruthy();
  });
});
