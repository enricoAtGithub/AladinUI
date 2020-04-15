export interface AvailabilityResource {
    Id: number;
    Name: string;
    Availabilities: Availability[];
}

export interface Availability {
    Id: string;
    RefId: number;
    Subject: string;
    Description: string;
    StartTime: Date;
    EndTime: Date;
    IsReadonly: boolean;
    Color: string;
    isAllDay: boolean;
    isAvailable: boolean;
    ResourceID?: number;
    TimeFrameStr: string;
}
