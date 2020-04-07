/*
Overview of built in fields for Syncfusion Angular scheduler:
https://ej2.syncfusion.com/angular/documentation/schedule/appointments/?no-cache=1#event-fields
Note: Scheduler Component requires properties starting with capital letter
 */

export interface Absence {
    Id: string;
    RefId: number;
    Subject: string;                        // from Backend
    Description: String;                    // from Backend
    StartTime: Date;                        // from Backend
    EndTime: Date;                          // from Backend
    TimeFrameStr: string;
    IsReadonly: boolean;                    // from Backend
    Color: string;                          // from Backend
    Type: string;
    IsAllDay?: boolean;                     // from Backend
    ResourceID?: number;
}

export interface SchedulerEvent extends Absence {
    AssignedResources: number;              // from Backend    
    StartTimezone?: string;                 // from Backend
    EndTimezone?: string;                   // from Backend
    Location?: string;                      // from Backend
    IsBlock?: boolean;                      // from Backend
    MissingResources: boolean;              // from Backend
    TooManyResources: boolean;              // from Backend
    ResourceConflictDescription: string;    // from backend
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
    IsUnavailable: SchedulerEvent[];               // from Backend
}
