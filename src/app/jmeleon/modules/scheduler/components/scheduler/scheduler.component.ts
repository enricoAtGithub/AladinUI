import { Component, OnInit } from '@angular/core';
import { View, EventSettingsModel, TimeScaleModel, DragEventArgs, ResizeEventArgs, GroupModel, EventClickArgs, ScheduleComponent, EJ2Instance, WorkHoursModel } from '@syncfusion/ej2-angular-schedule';

import { SchedulerEventService } from '../../services/scheduler-event.service';
import { SchedulerEvent } from '../../models/scheduler-event';

import { SchedulerResourceService } from '../../services/scheduler-rescource.service';
import { SchedulerResource} from '../../models/scheduler-resource';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  //can be removed later (mock data created only for March)
  public selectedDateEventScheduler: Date = new Date(2020,2,3);
  
  public setEventSchedulerView: View = 'TimelineWorkWeek';
  public schedulerEventTime: WorkHoursModel;
  public selectedDateResourceScheduler: Date;
  
  public setResourceSchedulerView: View ='TimelineDay';  
  public showResourceScheduler: Boolean = false;
  
  //Wann public, wann private, wann nix von beidem?
  public eventSchedulerObject: EventSettingsModel; 
  public resourceSchedulerObject: EventSettingsModel; 
  public resourceDataSource: Object[];

  public schedulerEvents$: SchedulerEvent[];
  public schedulerResources$: SchedulerResource[];
  public assignedSchedulerResources: SchedulerResource[];

  public groupData: GroupModel = {
    resources: ['Resources']
 //   allowGroupEdit: true
  };
  

  constructor(
    private schedulerEventService: SchedulerEventService,
    private schedulerResourceService: SchedulerResourceService,
    ) { }

  ngOnInit() {
    //determine scheduler events, remove double entries in case of multiple resources assigned (parameter woDuplicates = true)
    this.eventSchedulerObject  = { dataSource: this.getSchedulerEvents(true) }
  }

  getSchedulerEvents(woDuplicates: boolean): SchedulerEvent[] {
    this.schedulerEventService.getSchedulerEvents()
      .subscribe(schedulerEvents => this.schedulerEvents$ = schedulerEvents)
    if (woDuplicates)  
    {
      this.schedulerEvents$ = this.schedulerEvents$.filter((test, index, array) =>
        index === array.findIndex((findTest) =>
          findTest.Id === test.Id
          )
        );
    }
    return this.schedulerEvents$
  }

  getSchedulerResources(schedulerEventId: number): void {
    this.schedulerResourceService.getSchedulerResources(schedulerEventId)
      .subscribe(schedulerResources => this.schedulerResources$ = schedulerResources)
  }

  onDragStart(args: DragEventArgs): void {
    args.interval = 15;    
    args.excludeSelectors = 'e-all-day-cells'; 
  }

  onResizeStart(args: ResizeEventArgs): void {
    args.interval = 15;
  }
  
  onEventClick(args: EventClickArgs): void {  
    //determine all scheduler events including double entries in case of multiple resources (parameter woDuplicates = false)
    this.resourceSchedulerObject  = { dataSource: this.getSchedulerEvents(false) }
    
    //access clicked scheduler event
    //two type casts necessary since args.event cannot be casted directly to SchedulerEvent
    const schedulerEvent = <SchedulerEvent>(args.event as unknown);  
    
    //get all resources with State (assigned, available, blocked) depending on clicked event
    this.getSchedulerResources(schedulerEvent.Id);
    
    //find resources assigned to clicked event 
    this.assignedSchedulerResources = this.schedulerResources$.filter(arr=> arr.State === "assigned");
    this.resourceDataSource = this.assignedSchedulerResources;  
        
    //Task #1340: show times outside of event time in grey
    const start = <string>(schedulerEvent.StartTime.getHours() as unknown) + ":" + <string>(schedulerEvent.StartTime.getMinutes() as unknown);
    const end = <string>(schedulerEvent.EndTime.getHours() as unknown) + ":" + <string>(schedulerEvent.EndTime.getMinutes() as unknown);
    // e.g.: schedulerEventTime="{ start: '08:00', end: '9:30' }"
    this.schedulerEventTime = { start: start, end: end };

    this.selectedDateResourceScheduler = schedulerEvent.StartTime;
    this.showResourceScheduler = true;  
  }
}
