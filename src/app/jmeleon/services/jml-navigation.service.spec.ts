import { TestBed } from '@angular/core/testing';

import { JmlNavigationService } from './jml-navigation.service';

describe('JmlNavigationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JmlNavigationService = TestBed.get(JmlNavigationService);
    expect(service).toBeTruthy();
  });
});
