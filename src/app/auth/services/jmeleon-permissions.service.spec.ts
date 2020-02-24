import { TestBed } from '@angular/core/testing';

import { JMeleonPermissionsService } from './jmeleon-permissions.service';

describe('PermissionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JMeleonPermissionsService = TestBed.get(JMeleonPermissionsService);
    expect(service).toBeTruthy();
  });
});
