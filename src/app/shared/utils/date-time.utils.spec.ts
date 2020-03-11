import { TestBed } from '@angular/core/testing';
import DateTimeUtils from './date-time.utils';

describe('DateTimeUtils', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  // public static convertApiDateTimeStringToDate(apiDateString: string): Date

  it('convertApiDateTimeStringToDate - should convert an api date-string into a date object', () => {
    const testDate = DateTimeUtils.convertApiDateTimeStringToDate('2020-03-10T11:09:43');
    expect(testDate !== null && testDate !== undefined).toBeTruthy();
  });

  it('convertApiDateTimeStringToDate - should convert an api date-string into a date object with correct values', () => {
    const testDate = DateTimeUtils.convertApiDateTimeStringToDate('2020-03-10T11:09:43');
    const expectedDate = new Date(2020, (3 - 1), 10, 11, 9, 43); // month is zero-based
    expect(testDate).toEqual(expectedDate);
  });

  // convertDateToApiConformTimeString(date: Date): string

  it('convertDateToApiConformTimeString - should convert a date object into a iso-datetime-string', () => {
    const testDate = DateTimeUtils.convertDateToApiConformTimeString(new Date(2020, (3 - 1), 10, 11, 9, 43)); // month is zero-based
    expect(testDate !== null && testDate !== undefined).toBeTruthy();
  });

  it('convertDateToApiConformTimeString - should convert a date object into a iso-datetime-string with correct value', () => {
    const testDate = DateTimeUtils.convertDateToApiConformTimeString(new Date(2020, (3 - 1), 10, 11, 9, 43)); // month is zero-based
    const expectedDate = '2020-03-10T11:09:43';
    expect(testDate).toEqual(expectedDate);
  });

  it('convertDateToApiConformTimeString - should convert a date object into a iso-datetime-string with correct value', () => {
    const testDate = DateTimeUtils.convertDateToApiConformTimeString(new Date(2020, (3 - 1), 10, 11, 9, 43)); // month is zero-based
    const expectedDate = '2020-03-10T11:09:43';
    expect(testDate).toEqual(expectedDate);
  });

  it('convertDateToApiConformTimeString - should convert a un-initialized date object into null', () => {
    expect(DateTimeUtils.convertDateToApiConformTimeString(null)).toEqual(null);
    expect(DateTimeUtils.convertDateToApiConformTimeString(undefined)).toEqual(null);
  });

  // convertDateStringToApiConformTimeString(dateString: string): string


  it('convertDateStringToApiConformTimeString - should convert a date string (dd.MM.yyyy, as used by p-calendar) into ISO-datetime format string',
  () => {
    const testDate = DateTimeUtils.convertDateStringToApiConformTimeString('20.02.2020');
    const expectedDate = '2020-02-20T00:00:00';
    expect(testDate).toEqual(expectedDate);
  });

  it('convertDateStringToApiConformTimeString - should fail converting an un-initialized date string into ISO-datetime format string',
  () => {
    expect(DateTimeUtils.convertDateStringToApiConformTimeString(null)).toEqual(null);
    expect(DateTimeUtils.convertDateStringToApiConformTimeString(undefined)).toEqual(null);
  });

  // convertApiDateTimeStringToCalendarString(apiDateString: string): string

  it('convertApiDateTimeStringToCalendarString - should convert a ISO-datetime format string into a date string (dd.MM.yyyy, as used by p-calendar)',
  () => {
    const testDate = DateTimeUtils.convertApiDateTimeStringToCalendarString('2020-02-20T00:00:00');
    const expectedDate = '20.02.2020';
    expect(testDate).toEqual(expectedDate);
  });

  it('convertApiDateTimeStringToCalendarString - should convert a un-initialized date object into null', () => {

    // expect(DateTimeUtils.convertApiDateTimeStringToCalendarString(null)).toEqual('');
    // expect(DateTimeUtils.convertApiDateTimeStringToCalendarString(undefined)).toEqual('');
    expect(DateTimeUtils.convertApiDateTimeStringToCalendarString(null)).toEqual(null);
    expect(DateTimeUtils.convertApiDateTimeStringToCalendarString(undefined)).toEqual(null);
  });

  // public addDays(date: Date, days: number)

  it('addDays - should add n days to date and return a valid date',
  () => {
    // regular operation
    const testDate = DateTimeUtils.addDays(new Date(2020, (3 - 1), 10, 0, 0, 0), 3);
    const expectedDate = new Date(2020, (3 - 1), 13, 0, 0, 0);
    expect(testDate).toEqual(expectedDate);

    // into next month
    const testDate2 = DateTimeUtils.addDays(new Date(2020, (3 - 1), 31, 0, 0, 0), 3);
    const expectedDate2 = new Date(2020, (4 - 1), 3, 0, 0, 0);
    expect(testDate2).toEqual(expectedDate2);

    // into prev. month
    const testDate3 = DateTimeUtils.addDays(new Date(2020, (3 - 1), 3, 0, 0, 0), -3);
    const expectedDate3 = new Date(2020, (2 - 1), 29, 0, 0, 0);
    expect(testDate3).toEqual(expectedDate3);
  });












});

