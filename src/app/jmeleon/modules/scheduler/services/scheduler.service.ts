import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { SchedulerEvent } from '../models/scheduler-event';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from 'src/app/shared/app-config';
import { DateTimeService } from 'src/app/shared/services/date-time.service';
import { SchedulerResource } from '../models/scheduler-resource';

interface SchedulerEventInterface {
  schedulerOrders: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  constructor(
    private http: HttpClient) { }

  getSchedulerEvents(): Observable<SchedulerEvent[]> {
    const schedulerEventServiceUrl = AppConfig.uiInfo.baseUrl + '/scheduler/schedulerOrders';

    return this.http.get<SchedulerEventInterface>(schedulerEventServiceUrl)
      .pipe(
        map(temp => temp.schedulerOrders.map(serverEvent => {
          return {
            Id: serverEvent.Id,
            Subject: serverEvent.Subject,
            StartTime: serverEvent.StartTime,
            EndTime: serverEvent.EndTime,
            Description: serverEvent.Description,
            IsReadonly: serverEvent.IsReadonly
          };
        }))
      );

    // return this.http.get<SchedulerEvent[]>(this.schedulerEventServiceUrl).pipe(pluck('schedulerOrders'));
  }

  getSchedulerResources(schedulerEventId: number): Observable<SchedulerResource[]> {
    const schedulerResourceServiceUrl = AppConfig.uiInfo.baseUrl + '/scheduler/schedulerOrder' + '/' + schedulerEventId + '/resources';
    return this.http.get<SchedulerResource[]>(schedulerResourceServiceUrl).pipe(pluck('schedulerResources'));
  }
}
