import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/shared/app-config';
import { AvailabilityResource } from '../models/availability.model';
import { UrlCollection } from 'src/app/shared/url-collection';
import { DateTimeService } from 'src/app/shared/services/date-time.service';

interface AvailabilityInterface {
  resourceAvailabilities: any[];
}
interface ResourceInterface {
  resources: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  constructor(
    private http: HttpClient) { }

  getResourceAvailabilities(): Observable<AvailabilityResource[]> {
    // const url = AppConfig.uiInfo.baseUrl + '/scheduler/resourceAvailabilities';
    return this.http.get<AvailabilityInterface>(UrlCollection.Availability.RESOURCEAVAILABILITIES())
      .pipe(
        map(temp => temp.resourceAvailabilities.map(resource => {
          return {
            Id: resource.id,
            Name: resource.name,
            Availabilities: resource.availabilities.map(availability => {
              return {
                Id: 'availability#' + availability.id,
                RefId: availability.id,
                Subject: availability.subject,
                Description: availability.description,
                StartTime: availability.startTime,
                EndTime: availability.endTime,
                IsReadOnly: availability.isReadonly,
                Color: availability.color,
                IsAllDay: availability.isAllDay,
                IsAvailable: availability.IsAvailable
              };
            })
          };
        }
        ))
      );
  }

  updateAvailabilityInterval(availabilityId: number, startTime: string, endTime: string): Observable<any> {
    // const url = AppConfig.uiInfo.baseUrl + '/scheduler/resourceAvailability' + '/' + availabilityId + '/updateInterval';
    return this.http.post(UrlCollection.Availability.UPDATE_AVAILABILITY_INTERVAL(availabilityId), { start: startTime, end: endTime });
  }

}
