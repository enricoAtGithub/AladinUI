import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SchedulerResource } from '../models/scheduler-resource';
import { SCHEDULERRESOURCES } from '../models/mock-resources';

@Injectable({
  providedIn: 'root'
})
export class SchedulerResourceService {

  constructor() { }

  getSchedulerResources(): Observable<SchedulerResource[]> {
    return of(SCHEDULERRESOURCES);   
  }
}