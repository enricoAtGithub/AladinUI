// Overview of built in fields for Syncfusion Angular scheduler:
// https://ej2.syncfusion.com/angular/documentation/schedule/appointments/?no-cache=1#event-fields
export interface SchedulerEvent {
    Id: number;
    Subject: string;
    Description: String;
    StartTime: Date;
    EndTime: Date;
    AssignedResources: number;
    IsReadonly: boolean;
    Color?: string;
    StartTimezone?: string;
    EndTimezone?: string;
    Location?: string;
    IsAllDay?: boolean;
    RecurrenceID?: number;
    RecurrenceRule?: string;
    RecurrenceException?: string;
    IsBlock?: boolean;
    ResourceID?: number;
}
