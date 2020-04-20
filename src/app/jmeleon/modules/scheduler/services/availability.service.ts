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

  getResourceAvailabilities({ start, end }: { start: string, end: string }): Observable<AvailabilityResource[]> {
    // const url = AppConfig.uiInfo.baseUrl + '/scheduler/resourceAvailabilities';
    console.log({ start, end });
    return this.http.get<AvailabilityInterface>(UrlCollection.Availability.RESOURCEAVAILABILITIES())
      .pipe(
        map(temp => temp.resourceAvailabilities.map(resource => {
          return {
            Id: resource.id,
            Name: resource.name,
            Availabilities: resource.availabilities.map(availability => {
              const startDateTime = DateTimeService.convertApiDateTimeStringToDate(availability.startTime);
              const endDateTime = DateTimeService.convertApiDateTimeStringToDate(availability.endTime);
              let timeframeStr = '';
              if (availability.isAllDay) {
                timeframeStr = 'Ganzer Tag';
              } else {
                timeframeStr = this.getTimeframeAsString(startDateTime, endDateTime);
              }

              return {
                Id: 'availability#' + availability.id,
                RefId: availability.id,
                Subject: availability.subject,
                Description: availability.description,
                StartTime: startDateTime,
                EndTime: endDateTime,
                IsReadOnly: availability.isReadonly,
                Color: availability.color,
                IsAllDay: availability.isAllDay,
                IsAvailable: availability.IsAvailable,
                TimeFrameStr: timeframeStr
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

  getTimeframeAsString(startDateTime: Date, endDateTime: Date): string {
    const startTimeStr = startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTimeStr = endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timeFrameStr = startTimeStr + ' - ' + endTimeStr;
    return timeFrameStr;
  }

}
