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
    const hours = this.addZero(date.getHours());
    const days = this.addZero(date.getDate());
    const month = this.addZero(date.getMonth() + 1); // .getMonth is zero-based.
    const year = this.addZero(date.getFullYear());

    const result = `${year}-${month}-${days}T${hours}:${minutes}:${seconds}`;

    return result;
  }

  convertDateStringToApiConformTimeString(dateString: string): string {
    const dateComponents = dateString.split('.');

    // this is asking for trouble. todo: switch date management to moment.js
    const date = new Date(+dateComponents[2], +dateComponents[1] - 1, +dateComponents[0]);
    return this.convertDateToApiConformTimeString(date);
  }

  public static convertApiDateTimeStringToDate = function (apiDateString: string): Date {
    if (!apiDateString) {
      return null;
    }
    var [datePart, timePart] = apiDateString.split('T')
    const dateSubParts = datePart.split('-');
    const timeSubParts = timePart.split(':');
    //console.log(dateSubParts)
    //console.log(timeSubParts)

    // this is asking for trouble. todo: switch date management to moment.js
    return new Date(+dateSubParts[0], +dateSubParts[1] - 1, +dateSubParts[2], +timeSubParts[0], +timeSubParts[1], +timeSubParts[2]);
  }

  convertApiDateTimeStringToCalendarString(apiDateString: string): string {
    if (!apiDateString) {
      return '';
    }
    const datePart = apiDateString.split('T')[0];
    const dateSubParts = datePart.split('-');
    const result = `${dateSubParts[2]}.${dateSubParts[1]}.${dateSubParts[0]}`;
    return result;
  }

  public addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private addZero(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }
}
