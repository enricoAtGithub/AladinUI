import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SchedulerEvent } from '../models/scheduler-event';
import { SCHEDULEREVENTS } from '../models/mock-events';

@Injectable({
  providedIn: 'root'
})
export class SchedulerEventService {

  constructor() { }

  getSchedulerEvents(): Observable<SchedulerEvent[]> {
    return of(SCHEDULEREVENTS);
  }
}
