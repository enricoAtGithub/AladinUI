import { TestBed } from '@angular/core/testing';

import { SchedulerResourceService } from './scheduler-rescource.service';

describe('SchedulerResourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchedulerResourceService = TestBed.get(SchedulerResourceService);
    expect(service).toBeTruthy();
  });
});
