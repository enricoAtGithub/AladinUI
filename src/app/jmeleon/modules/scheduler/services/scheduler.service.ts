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

interface SchedulerResourceInterface {
  schedulerResources: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  icon: string;
  altText: string;

  constructor(
    private http: HttpClient) { }

  getSchedulerEvents(): Observable<SchedulerEvent[]> {
    const url = AppConfig.uiInfo.baseUrl + '/scheduler/schedulerOrders';

    return this.http.get<SchedulerEventInterface>(url)
      .pipe(
        // map properties from JSON response, first letter of properties needs to be capitalized
        map(temp => temp.schedulerOrders.map(schEv => {
          return {
            Id: schEv.id,
            Subject: schEv.subject,
            StartTime: schEv.startTime,
            EndTime: schEv.endTime,
            Description: schEv.description,
            IsReadonly: schEv.isReadonly
          };
        }))
      );
  }

  getSchedulerResources(schedulerEventId: number): Observable<SchedulerResource[]> {
    const url = AppConfig.uiInfo.baseUrl + '/scheduler/schedulerOrder' + '/' + schedulerEventId + '/resources';
    // return this.http.get<SchedulerResource[]>(url).pipe(pluck('schedulerResources'));
    return this.http.get<SchedulerResourceInterface>(url)
      .pipe(
        // map properties from JSON response, first letter of properties needs to be capitalized
        map(temp => temp.schedulerResources.map(schRes => {
          switch (schRes.state) {
            case 'assigned': {
              this.icon = 'pi pi-check';
              this.altText = 'zugeordnet';
              break;
            }
            case 'available': {
              this.icon = 'pi pi-times';
              this.altText = 'nicht zugeordnet';
              break;
            }
            case 'blocked': {
              this.icon = 'pi pi-lock';
              this.altText = 'nicht verfügbar';
              break;
            }
          }
          return {
            Id: schRes.id,
            Name: schRes.name,
            State: schRes.state,
            Icon: this.icon,
            AltText: this.altText,
            isAssignedTo: schRes.isAssignedTo.map(schEv => {
              return {
                Id: schEv.id,
                Subject: schEv.subject,
                Description: schEv.description,
                StartTime: schEv.startTime,
                EndTime: schEv.endTime,
                IsReadonly: schEv.isReadonly
              };
            })
          };
        }))
      );
  }

  updateSchedulerEventInterval(schedulerEventId: number, startTime: string, endTime: string): Observable<any> {
    const url = AppConfig.uiInfo.baseUrl + '/scheduler/schedulerOrder' + '/' + schedulerEventId + '/updateOrderInterval';
    return this.http.post(url, { start: startTime, end: endTime });
  }
}
