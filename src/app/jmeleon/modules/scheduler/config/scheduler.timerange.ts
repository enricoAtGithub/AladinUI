import { View } from '@syncfusion/ej2-angular-schedule';

export class TimeRange {
    constructor(start: Date, end: Date) {
        this.start = start;
        this.end = end;
    }
    public start: Date;
    public end: Date;
}
export abstract class SchedulerTimeRange {
    static get(view: View): SchedulerTimeRange {
        if (!timeRangeMap.hasOwnProperty(view)) {
            console.error('Unknown Scheduler View ' + view);
        }
        return timeRangeMap[view];
    }
    protected getRangeInternal(navigationDate: Date, startDay: number, days: number): TimeRange {
        const endDay: number = startDay + days;
        const month: number = navigationDate.getMonth();
        const year: number = navigationDate.getFullYear();
        const startDate = new Date(year, month, startDay);
        const endDate = new Date(year, month, endDay);
        return new TimeRange(startDate, endDate);
    }
    abstract getRange(navigationDate: Date): TimeRange;

}
export class TimelineWorkWeek extends SchedulerTimeRange {
    public getRange(navigationDate: Date) {
        const startDay: number = navigationDate.getDate() - navigationDate.getDay() + 1;
        return super.getRangeInternal(navigationDate, startDay, 5);
    }
}
export class WorkWeek extends SchedulerTimeRange {
    public getRange(navigationDate: Date) {
        const startDay: number = navigationDate.getDate() - navigationDate.getDay() + 1;
        return super.getRangeInternal(navigationDate, startDay, 5);
    }
}
export class TimelineDay extends SchedulerTimeRange {
    public getRange(navigationDate: Date) {
        const startDay: number = navigationDate.getDate();
        return super.getRangeInternal(navigationDate, startDay, 1);
    }
}
export class TimelineMonth extends SchedulerTimeRange {
    public getRange(navigationDate: Date) {
        const month: number = navigationDate.getMonth();
        const year: number = navigationDate.getFullYear();
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 1);
        return new TimeRange(startDate, endDate);
    }
}
export const timeRangeMap = {
    TimelineWorkWeek: new TimelineWorkWeek(),
    WorkWeek: new WorkWeek(),
    TimelineDay: new TimelineDay(),
    TimelineMonth: new TimelineMonth()
};
