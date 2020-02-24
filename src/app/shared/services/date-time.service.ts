import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  readonly CALENDAR_DATE_FORMAT = 'dd.mm.yy';

  constructor() { }

  /**
   * Converts a date object in to the text format expected by the server.
   *
   * (To stay in local time, using date.toISOString() is not recommended.)
   *
   * @param {Date} date - The date to convert into the date string used by the API.
   * @returns {string} The converted date string in the format: 'yyyy-MM-ddThh:mm:ss'.
   * @memberof DateTimeService
   */
  convertDateToApiConformTimeString(date: Date): string {

    if (!date) {
      return null;
    }

    const seconds = this.addZero(date.getSeconds());
    const minutes = this.addZero(date.getMinutes());
    const hours   = this.addZero(date.getHours());
    const days    = this.addZero(date.getDate());
    const month   = this.addZero(date.getMonth() + 1); // .getMonth is zero-based.
    const year    = this.addZero(date.getFullYear());

    const result  = `${year}-${month}-${days}T${hours}:${minutes}:${seconds}`;

    return result;
  }

  convertDateStringToApiConformTimeString(dateString: string): string {
    const dateComponents = dateString.split('.');

    // this is asking for trouble. todo: switch date management to moment.js
    const date = new Date(+dateComponents[2], +dateComponents[1] - 1, +dateComponents[0]);
    return this.convertDateToApiConformTimeString(date);
  }

  convertApiDateTimeStringToCalendarString(apiDateString: string): string {
    const datePart = apiDateString.split('T')[0];
    const dateSubParts = datePart.split('-');
    const result = `${dateSubParts[2]}.${dateSubParts[1]}.${dateSubParts[0]}`;
    return result;
  }

  private addZero(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }
}
