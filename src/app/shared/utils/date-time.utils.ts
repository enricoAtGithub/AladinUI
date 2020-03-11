import moment from 'moment';
/**
 * this util class collects jmeleon specific functions for working with dates and times.
 */
export default class DateTimeUtils {

    static readonly ISO_FORMAT_STRING = 'YYYY-MM-DDTHH:mm:ss';
    static readonly DATE_ONLY_FORMAT_STRING = 'DD.MM.YYYY';

    static convertApiDateTimeStringToDate = (apiDateString: string): Date =>
        !apiDateString ? null : moment(apiDateString).toDate()

    static convertDateToApiConformTimeString = (date: Date): string =>
        !date ? null : moment(date).format(DateTimeUtils.ISO_FORMAT_STRING)

    // still needed?
    static addZero = (n: number): string => n < 10 ? `0${n}` : `${n}`;

    static convertDateStringToApiConformTimeString = (dateString: string): string =>
        !dateString ? null : moment(dateString, DateTimeUtils.DATE_ONLY_FORMAT_STRING)
            .format(DateTimeUtils.ISO_FORMAT_STRING)

    // todo:
    // this method used to return empty string if input was null.
    // for unifying sake it will now also return null in that case
    // check consumers for null-check
    static convertApiDateTimeStringToCalendarString = (apiDateString: string): string =>
        !apiDateString ? null : moment(apiDateString).format(DateTimeUtils.DATE_ONLY_FORMAT_STRING)

    static addDays = (date: Date, days: number) => moment(date).add(days, 'days').toDate();
}
