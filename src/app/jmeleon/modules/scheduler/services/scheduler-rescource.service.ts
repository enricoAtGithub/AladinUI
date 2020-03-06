import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SchedulerResource } from '../models/scheduler-resource';
import { SCHEDULERRESOURCES1, SCHEDULERRESOURCES2, SCHEDULERRESOURCES3, SCHEDULERRESOURCES4, SCHEDULERRESOURCES5, SCHEDULERRESOURCES6 } from '../models/mock-resources';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SchedulerResourceService {
  constructor() { }

  getSchedulerResources(schedulerEventId: number): Observable<SchedulerResource[]> {
    // Switch in order to provide correct Mock Data
    switch (schedulerEventId) {
      case 1: {
        return of(SCHEDULERRESOURCES1);
      }
      case 2: {
        return of(SCHEDULERRESOURCES2);
      }
      case 3: {
        return of(SCHEDULERRESOURCES3);
      }
      case 4: {
        return of(SCHEDULERRESOURCES4);
      }
      case 5: {
        return of(SCHEDULERRESOURCES5);
      }
      case 6: {
        return of(SCHEDULERRESOURCES6);
      }
    }
  }
}
