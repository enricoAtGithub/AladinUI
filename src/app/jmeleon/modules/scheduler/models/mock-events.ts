import { SchedulerEvent } from './scheduler-event';

export const SCHEDULEREVENTS: SchedulerEvent[] = [
    {
        Id: 1,
        Subject: 'Rüschtüsch viel Arbeit',
        StartTime: new Date(2020, 2, 3, 9, 0),
        EndTime: new Date(2020, 2, 3, 10, 30),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
        // ResourceID: 1
    },
    {
        Id: 1,
        Subject: 'Rüschtüsch viel Arbeit',
        StartTime: new Date(2020, 2, 3, 9, 0),
        EndTime: new Date(2020, 2, 3, 10, 30),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
        // ResourceID: 2
    },
    {
        Id: 2,
        Subject: 'Noch mehr Arbeit',
        StartTime: new Date(2020, 2, 3, 15, 0),
        EndTime: new Date(2020, 2, 3, 16, 30),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
        // ResourceID: 2
    },
    {
        Id: 3,
        Subject: 'Die Base chillen',
        StartTime: new Date(2020, 2, 3, 12, 0),
        EndTime: new Date(2020, 2, 3, 14, 0),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
        // ResourceID: 2
        // IsBlock: true
    },
    {
        Id: 4,
        Subject: 'Eine schöne Konferenz',
        StartTime: new Date(2020, 2, 4),
        EndTime: new Date(2020, 2, 4),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
        // ResourceID: 2,
        IsAllDay: true
    },
    {
        Id: 5,
        Subject: 'Schreibgeschütztes Event',
        StartTime: new Date(2020, 2, 5, 9, 0),
        EndTime: new Date(2020, 2, 5, 12, 30),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
        // ResourceID: 2,
        IsReadonly: true
    },
    {
        Id: 6,
        Subject: 'Zu viel Arbeit',
        StartTime: new Date(2020, 2, 3, 10, 0),
        EndTime: new Date(2020, 2, 3, 11, 30),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
        // ResourceID: 3
    }
];
