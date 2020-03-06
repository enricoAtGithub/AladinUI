// Overview of built in fields for Syncfusion Angular scheduler:
// https://ej2.syncfusion.com/angular/documentation/schedule/appointments/?no-cache=1#event-fields
export interface SchedulerEvent {
    Id: number;
    Subject: string;
    StartTime: Date;
    EndTime: Date;
    StartTimezone?: string;
    EndTimezone?: string;
    Location?: string;
    Description?: String;
    IsAllDay?: boolean;
    RecurrenceID?: number;
    RecurrenceRule?: string;
    RecurrenceException?: string;
    IsReadonly?: boolean;
    IsBlock?: boolean;
    ResourceID?: number;
}
