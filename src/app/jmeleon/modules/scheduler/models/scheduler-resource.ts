import { SchedulerEvent } from '../models/scheduler-event';

// Overview of built in fields for Syncfusion Angular scheduler:
// https://ej2.syncfusion.com/angular/documentation/schedule/appointments/?no-cache=1#event-fields
export interface SchedulerResource {
    Id: number;                             // from Backend
    Name: string;                           // from Backend
    Assigned: boolean;                      // from Backend
    AssignedIcon?: string;
    AssignedAltText?: string;
    HasConflict: boolean;                   // from Backend
    HasConflictIcon?: string;
    HasConflictAltText?: string;
    isAssignedTo: SchedulerEvent[];         // from Backend
}
