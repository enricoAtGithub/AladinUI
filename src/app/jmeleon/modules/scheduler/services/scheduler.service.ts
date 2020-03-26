import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/shared/app-config';
import { SchedulerEvent, SchedulerResource } from '../models/scheduler.model';
import { UrlCollection } from 'src/app/shared/url-collection';

interface SchedulerEventInterface {
  schedulerOrders: any[];
}

interface SchedulerResourceInterface {
  schedulerResources: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  constructor(
    private http: HttpClient) { }

  getSchedulerEvents(): Observable<SchedulerEvent[]> {
    // const url = AppConfig.uiInfo.baseUrl + '/scheduler/schedulerOrders';

    return this.http.get<SchedulerEventInterface>(UrlCollection.Scheduler.SCHEDULER_ORDERS())
      .pipe(
        // map properties from JSON response, first letter of properties needs to be capitalized
        map(temp => temp.schedulerOrders.map(schEv => {
          return {
            Id: schEv.id,
            Subject: schEv.subject,
            StartTime: schEv.startTime,
            EndTime: schEv.endTime,
            Description: schEv.description,
            IsReadonly: schEv.isReadonly,
            AssignedResources: schEv.assignedResources
          };
        }))
      );
  }

  getSchedulerResources(schedulerEventId: number): Observable<SchedulerResource[]> {
    // const url = AppConfig.uiInfo.baseUrl + '/scheduler/schedulerOrder' + '/' + schedulerEventId + '/resources';
    return this.http.get<SchedulerResourceInterface>(UrlCollection.Scheduler.SCHEDULER_RESOURCES(schedulerEventId))
      .pipe(
        // map properties from JSON response, first letter of properties needs to be capitalized
        map(temp => temp.schedulerResources.map(schRes => {
          return {
            Id: schRes.id,
            Name: schRes.name,
            Assigned: schRes.assigned,
            HasConflict: schRes.hasConflict,
            isAssignedTo: schRes.isAssignedTo.map(schEv => {
              return {
                Id: schEv.id,
                Subject: schEv.subject,
                Description: schEv.description,
                StartTime: schEv.startTime,
                EndTime: schEv.endTime,
                IsReadonly: schEv.isReadonly,
                AssignedResources: schEv.assignedResources
              };
            })
          };
        }))
      );
  }

  updateSchedulerEventInterval(schedulerEventId: number, startTime: string, endTime: string): Observable<any> {
    // const url = AppConfig.uiInfo.baseUrl + '/scheduler/schedulerOrder' + '/' + schedulerEventId + '/updateOrderInterval';
    return this.http.post(UrlCollection.Scheduler.UPDATE_ORDER_INTERVAL(schedulerEventId), { start: startTime, end: endTime });
  }

  assignResourceToSchedulerEvent(schedulerEventId: number, resourceId: number): Observable<any> {
    // const url = AppConfig.uiInfo.baseUrl + '/scheduler/schedulerOrder' + '/' + schedulerEventId + '/resource/' + resourceId + '/assign';
    return this.http.post(UrlCollection.Scheduler.ASSIGN_RESOURCE(schedulerEventId, resourceId), {});
  }

  removeResourceFromSchedulerEvent(schedulerEventId: number, resourceId: number): Observable<any> {
    // const url = AppConfig.uiInfo.baseUrl + '/scheduler/schedulerOrder' + '/' + schedulerEventId + '/resource/' + resourceId + '/remove';
    return this.http.post(UrlCollection.Scheduler.REMOVE_RESOURCE(schedulerEventId, resourceId), {});
  }

}
