import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  readonly CALENDAR_DATE_FORMAT = 'dd.mm.yy';

  constructor() { }
  public static convertApiDateTimeStringToDate = function (apiDateString: string): Date {
    if (!apiDateString) {
      return null;
    }
    let [datePart, timePart] = apiDateString.split('T');
    const dateSubParts = datePart.split('-');
    const timeSubParts = timePart.split(':');

    // this is asking for trouble. todo: switch date management to moment.js
    return new Date(+dateSubParts[0], +dateSubParts[1] - 1, +dateSubParts[2], +timeSubParts[0], +timeSubParts[1], +timeSubParts[2]);
  }

  /**
   * Converts a date object in to the text format expected by the server.
   *
   * (To stay in local time, using date.toISOString() is not recommended.)
   *
   * @param {Date} date - The date to convert into the date string used by the API.
   * @returns {string} The converted date string in the format: 'yyyy-MM-ddThh:mm:ss'.
   * @memberof DateTimeService
   */
  public static convertDateToApiConformTimeString = function (date: Date): string {

    if (!date) {
      return null;
    }

    const seconds = DateTimeService.addZero(date.getSeconds());
    const minutes = DateTimeService.addZero(date.getMinutes());
    const hours = DateTimeService.addZero(date.getHours());
    const days = DateTimeService.addZero(date.getDate());
    const month = DateTimeService.addZero(date.getMonth() + 1); // .getMonth is zero-based.
    const year = DateTimeService.addZero(date.getFullYear());

    const result = `${year}-${month}-${days}T${hours}:${minutes}:${seconds}`;

    return result;
  };

  public static addZero = function (n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  convertDateStringToApiConformTimeString(dateString: string): string {

    const dateComponents = dateString.split('.');

    // this is asking for trouble. todo: switch date management to moment.js
    const date = new Date(+dateComponents[2], +dateComponents[1] - 1, +dateComponents[0]);
    return DateTimeService.convertDateToApiConformTimeString(date);
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

}
