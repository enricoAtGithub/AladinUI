/*
Overview of built in fields for Syncfusion Angular scheduler:
https://ej2.syncfusion.com/angular/documentation/schedule/appointments/?no-cache=1#event-fields
Note: Scheduler Component requires properties starting with capital letter
 */

export interface SchedulerEvent {
    Id: string;
    RefId: number;
    Subject: string;                        // from Backend
    Description: String;                    // from Backend
    StartTime: Date;                        // from Backend
    EndTime: Date;                          // from Backend
    TimeFrameStr: string;
    AssignedResources: number;              // from Backend
    IsReadonly: boolean;                    // from Backend
    Color: string;                          // from Backend
    Type: string;
    StartTimezone?: string;                 // from Backend
    EndTimezone?: string;                   // from Backend
    Location?: string;                      // from Backend
    IsAllDay?: boolean;                     // from Backend
    IsBlock?: boolean;                      // from Backend
    ResourceID?: number;
}

export interface SchedulerResource {
    Id: number;                             // from Backend
    Name: string;                           // from Backend
    Assigned: boolean;                      // from Backend
    AssignedIcon?: string;
    AssignedAltText?: string;
    HasConflict: boolean;                   // from Backend
    HasConflictIcon?: string;
    HasConflictAltText?: string;
    IsAssignedTo: SchedulerEvent[];         // from Backend
    IsUnavailable: SchedulerEvent[];        // from Backend
}
