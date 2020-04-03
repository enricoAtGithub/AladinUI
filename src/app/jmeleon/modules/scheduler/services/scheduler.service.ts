import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/shared/app-config';
import { SchedulerEvent, SchedulerResource } from '../models/scheduler.model';
import { UrlCollection } from 'src/app/shared/url-collection';
import { DateTimeService } from 'src/app/shared/services/date-time.service';

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
          const startDateTime = DateTimeService.convertApiDateTimeStringToDate(schEv.startTime);
          const endDateTime = DateTimeService.convertApiDateTimeStringToDate(schEv.endTime);
          const timeframeStr = this.getTimeframeAsString(startDateTime, endDateTime);

          return {
            Id: schEv.id,
            Subject: schEv.subject,
            StartTime: startDateTime,
            EndTime: endDateTime,
            TimeFrameStr: timeframeStr,                // 'hh:mm - hh:mm'
            Description: schEv.description,
            IsReadonly: schEv.isReadonly,
            AssignedResources: schEv.assignedResources,
            Color: schEv.color
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
              const startDateTime = DateTimeService.convertApiDateTimeStringToDate(schEv.startTime);
              const endDateTime = DateTimeService.convertApiDateTimeStringToDate(schEv.endTime);
              const timeframeStr = this.getTimeframeAsString(startDateTime, endDateTime);

              return {
                Id: schEv.id,
                Subject: schEv.subject,
                Description: schEv.description,
                StartTime: startDateTime,
                EndTime: endDateTime,
                TimeFrameStr: timeframeStr,                // 'hh:mm - hh:mm'
                IsReadonly: schEv.isReadonly,
                AssignedResources: schEv.assignedResources,
                Color: schEv.color
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

  getTimeframeAsString(startDateTime: Date, endDateTime: Date): string {
    const startTimeStr = startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTimeStr = endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timeFrameStr = startTimeStr + ' - ' + endTimeStr;
    return timeFrameStr;
  }
}
