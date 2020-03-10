import { TestBed } from '@angular/core/testing';

import { SchedulerEventService } from './scheduler.service';

describe('SchedulerEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchedulerEventService = TestBed.get(SchedulerEventService);
    expect(service).toBeTruthy();
  });
});
