import { TestBed } from '@angular/core/testing';

import { JmeleonActionsFacadeService } from './jmeleon-actions-facade.service';

describe('JmeleonActionsFacadeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JmeleonActionsFacadeService = TestBed.get(JmeleonActionsFacadeService);
    expect(service).toBeTruthy();
  });
});
