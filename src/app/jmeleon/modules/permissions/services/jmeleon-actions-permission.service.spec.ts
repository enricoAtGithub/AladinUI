import { TestBed } from '@angular/core/testing';

import { JmeleonActionsPermissionService } from './jmeleon-actions-permission.service';

describe('JmeleonPermissionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
    expect(service).toBeTruthy();
  });
});
