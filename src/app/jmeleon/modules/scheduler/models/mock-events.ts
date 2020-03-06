import { SchedulerEvent } from './scheduler-event';

export const SCHEDULEREVENTS: SchedulerEvent[] = [
    {
        Id: 1,
        Subject: 'Rüschtüsch viel Arbeit',
        StartTime: new Date(2020, 2, 3, 9, 0),
        EndTime: new Date(2020, 2, 3, 10, 30),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.'
    },
    {
        Id: 2,
        Subject: 'Noch mehr Arbeit',
        StartTime: new Date(2020, 2, 3, 15, 0),
        EndTime: new Date(2020, 2, 3, 16, 30),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.'
    },
    {
        Id: 3,
        Subject: 'Die Base chillen',
        StartTime: new Date(2020, 2, 3, 12, 0),
        EndTime: new Date(2020, 2, 3, 14, 0),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.'
    },
    {
        Id: 4,
        Subject: 'Eine schöne Konferenz',
        StartTime: new Date(2020, 2, 4, 9, 0),
        EndTime: new Date(2020, 2, 4, 17, 0),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.'
    },
    {
        Id: 5,
        Subject: 'Schreibgeschütztes Event',
        StartTime: new Date(2020, 2, 5, 9, 0),
        EndTime: new Date(2020, 2, 5, 12, 30),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.',
        IsReadonly: true
    },
    {
        Id: 6,
        Subject: 'Zu viel Arbeit',
        StartTime: new Date(2020, 2, 3, 10, 0),
        EndTime: new Date(2020, 2, 3, 11, 30),
        Description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.'
    }
];
