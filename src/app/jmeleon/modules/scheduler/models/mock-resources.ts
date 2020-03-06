import { SchedulerResource } from './scheduler-resource';

export const SCHEDULERRESOURCES1: SchedulerResource[] = [
    {   Id: 1, 
        Name: "Peter Punk", 
        State: "assigned",
        isAssignedTo: [
            {
                Id: 1,
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 1 
            }
        ]
    },
    {
        Id: 2,        
        Name: "Sandra Samtig", 
        State: "assigned",
        isAssignedTo: [
            {
                Id: 1,
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 2,
                Subject: "Noch mehr Arbeit",
                StartTime: new Date(2020,2,3,15,0),
                EndTime: new Date(2020,2,3,16,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 3,
                Subject: "Die Base chillen",
                StartTime: new Date(2020,2,3,12,0),
                EndTime: new Date(2020,2,3,14,0),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2                
            },
            {
                Id: 4,
                Subject: "Eine schöne Konferenz",
                StartTime: new Date(2020,2,4),
                EndTime: new Date(2020,2,4),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",                
                IsAllDay: true,
                //ResourceID: 2,
            },
            {
                Id: 5,
                Subject: "Schreibgeschütztes Event",
                StartTime: new Date(2020,2,5,9,0),
                EndTime: new Date(2020,2,5,12,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                IsReadonly: true,
                //ResourceID: 2                
            },
        ]
    },
    {
        Id: 3,
        Name: "Konni Komisch",
        State: "blocked",
        isAssignedTo: [
            {
                Id: 6,
                Subject: "Zu viel Arbeit",
                StartTime: new Date(2020,2,3,10,0),
                EndTime: new Date(2020,2,3,11,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 3
            }
        ]
    }
];

export const SCHEDULERRESOURCES2: SchedulerResource[] = [
    {   Id: 1, 
        Name: "Peter Punk", 
        State: "available",
        isAssignedTo: [
            {
                Id: 1,
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 1 
            }
        ]
    },
    {
        Id: 2,        
        Name: "Sandra Samtig", 
        State: "assigned",
        isAssignedTo: [
            {
                Id: 1,                       
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 2,
                Subject: "Noch mehr Arbeit",
                StartTime: new Date(2020,2,3,15,0),
                EndTime: new Date(2020,2,3,16,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 3,
                Subject: "Die Base chillen",
                StartTime: new Date(2020,2,3,12,0),
                EndTime: new Date(2020,2,3,14,0),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2                
            },
            {
                Id: 4,
                Subject: "Eine schöne Konferenz",
                StartTime: new Date(2020,2,4),
                EndTime: new Date(2020,2,4),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",                
                IsAllDay: true,
                //ResourceID: 2,
            },
            {
                Id: 5,
                Subject: "Schreibgeschütztes Event",
                StartTime: new Date(2020,2,5,9,0),
                EndTime: new Date(2020,2,5,12,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                IsReadonly: true,
                //ResourceID: 2                
            },
        ]
    },
    {
        Id: 3,
        Name: "Konni Komisch",
        State: "available",
        isAssignedTo: [
            {
                Id: 6,
                Subject: "Zu viel Arbeit",
                StartTime: new Date(2020,2,3,10,0),
                EndTime: new Date(2020,2,3,11,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 3
            }
        ]
    }
];

export const SCHEDULERRESOURCES3: SchedulerResource[] = [
    {   Id: 1, 
        Name: "Peter Punk", 
        State: "available",
        isAssignedTo: [
            {
                Id: 1,                   
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 1 
            }
        ]
    },
    {
        Id: 2,        
        Name: "Sandra Samtig", 
        State: "assigned",
        isAssignedTo: [
            {
                Id: 1,                   
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 2,
                Subject: "Noch mehr Arbeit",
                StartTime: new Date(2020,2,3,15,0),
                EndTime: new Date(2020,2,3,16,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 3,
                Subject: "Die Base chillen",
                StartTime: new Date(2020,2,3,12,0),
                EndTime: new Date(2020,2,3,14,0),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2                
            },
            {
                Id: 4,
                Subject: "Eine schöne Konferenz",
                StartTime: new Date(2020,2,4),
                EndTime: new Date(2020,2,4),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",                
                IsAllDay: true,
                //ResourceID: 2,
            },
            {
                Id: 5,
                Subject: "Schreibgeschütztes Event",
                StartTime: new Date(2020,2,5,9,0),
                EndTime: new Date(2020,2,5,12,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                IsReadonly: true,
                //ResourceID: 2                
            },
        ]
    },
    {
        Id: 3,
        Name: "Konni Komisch",
        State: "available",
        isAssignedTo: [
            {
                Id: 6,
                Subject: "Zu viel Arbeit",
                StartTime: new Date(2020,2,3,10,0),
                EndTime: new Date(2020,2,3,11,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 3
            }
        ]
    }
];

export const SCHEDULERRESOURCES4: SchedulerResource[] = [
    {   Id: 1, 
        Name: "Peter Punk", 
        State: "available",
        isAssignedTo: [
            {
                Id: 1,                      
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 1 
            }
        ]
    },
    {
        Id: 2,        
        Name: "Sandra Samtig", 
        State: "assigned",
        isAssignedTo: [
            {
                Id: 1,                    
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 2,
                Subject: "Noch mehr Arbeit",
                StartTime: new Date(2020,2,3,15,0),
                EndTime: new Date(2020,2,3,16,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 3,
                Subject: "Die Base chillen",
                StartTime: new Date(2020,2,3,12,0),
                EndTime: new Date(2020,2,3,14,0),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2                
            },
            {
                Id: 4,
                Subject: "Eine schöne Konferenz",
                StartTime: new Date(2020,2,4),
                EndTime: new Date(2020,2,4),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",                
                IsAllDay: true,
                //ResourceID: 2,
            },
            {
                Id: 5,
                Subject: "Schreibgeschütztes Event",
                StartTime: new Date(2020,2,5,9,0),
                EndTime: new Date(2020,2,5,12,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                IsReadonly: true,
                //ResourceID: 2                
            },
        ]
    },
    {
        Id: 3,
        Name: "Konni Komisch",
        State: "available",
        isAssignedTo: [
            {
                Id: 6,
                Subject: "Zu viel Arbeit",
                StartTime: new Date(2020,2,3,10,0),
                EndTime: new Date(2020,2,3,11,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 3
            }
        ]
    }
];

export const SCHEDULERRESOURCES5: SchedulerResource[] = [
    {   Id: 1, 
        Name: "Peter Punk", 
        State: "available",
        isAssignedTo: [
            {
                Id: 1,                     
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 1 
            }
        ]
    },
    {
        Id: 2,        
        Name: "Sandra Samtig", 
        State: "assigned",
        isAssignedTo: [
            {
                Id: 1,                        
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 2,
                Subject: "Noch mehr Arbeit",
                StartTime: new Date(2020,2,3,15,0),
                EndTime: new Date(2020,2,3,16,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 3,
                Subject: "Die Base chillen",
                StartTime: new Date(2020,2,3,12,0),
                EndTime: new Date(2020,2,3,14,0),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2                
            },
            {
                Id: 4,
                Subject: "Eine schöne Konferenz",
                StartTime: new Date(2020,2,4),
                EndTime: new Date(2020,2,4),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",                
                IsAllDay: true,
                //ResourceID: 2,
            },
            {
                Id: 5,
                Subject: "Schreibgeschütztes Event",
                StartTime: new Date(2020,2,5,9,0),
                EndTime: new Date(2020,2,5,12,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                IsReadonly: true,
                //ResourceID: 2                
            },
        ]
    },
    {
        Id: 3,
        Name: "Konni Komisch",
        State: "available",
        isAssignedTo: [
            {
                Id: 6,
                Subject: "Zu viel Arbeit",
                StartTime: new Date(2020,2,3,10,0),
                EndTime: new Date(2020,2,3,11,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 3
            }
        ]
    }
];

export const SCHEDULERRESOURCES6: SchedulerResource[] = [
    {   Id: 1, 
        Name: "Peter Punk", 
        State: "blocked",
        isAssignedTo: [
            {
                Id: 1,                       
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 1 
            }
        ]
    },
    {
        Id: 2,        
        Name: "Sandra Samtig", 
        State: "available",
        isAssignedTo: [
            {
                Id: 1,                      
                Subject: 'Rüschtüsch viel Arbeit',
                StartTime: new Date(2020,2,3,9,0),
                EndTime: new Date(2020,2,3,10,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 2,
                Subject: "Noch mehr Arbeit",
                StartTime: new Date(2020,2,3,15,0),
                EndTime: new Date(2020,2,3,16,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2 
            },
            {
                Id: 3,
                Subject: "Die Base chillen",
                StartTime: new Date(2020,2,3,12,0),
                EndTime: new Date(2020,2,3,14,0),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 2                
            },
            {
                Id: 4,
                Subject: "Eine schöne Konferenz",
                StartTime: new Date(2020,2,4),
                EndTime: new Date(2020,2,4),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",                
                IsAllDay: true,
                //ResourceID: 2,
            },
            {
                Id: 5,
                Subject: "Schreibgeschütztes Event",
                StartTime: new Date(2020,2,5,9,0),
                EndTime: new Date(2020,2,5,12,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                IsReadonly: true,
                //ResourceID: 2                
            },
        ]
    },
    {
        Id: 3,
        Name: "Konni Komisch",
        State: "assigned",
        isAssignedTo: [
            {
                Id: 6,
                Subject: "Zu viel Arbeit",
                StartTime: new Date(2020,2,3,10,0),
                EndTime: new Date(2020,2,3,11,30),
                Description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
                //ResourceID: 3
            }
        ]
    }
];
