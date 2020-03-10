import { SchedulerEvent } from '../models/scheduler-event';

// Overview of built in fields for Syncfusion Angular scheduler:
// https://ej2.syncfusion.com/angular/documentation/schedule/appointments/?no-cache=1#event-fields
export interface SchedulerResource {
    Id: number;
    Name: string;
    State: string; // assigned/blocked/available
    Color?: string;
    isAssignedTo: SchedulerEvent[];
}
