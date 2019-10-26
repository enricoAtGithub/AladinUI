import { TestBed } from '@angular/core/testing';

import { DiagramColorService } from './diagram-color.service';

describe('DiagramColorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiagramColorService = TestBed.get(DiagramColorService);
    expect(service).toBeTruthy();
  });
});
