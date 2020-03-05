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
  private selectedDateEventScheduler: Date = new Date(2020,2,3);
  
  private setEventSchedulerView: View = 'TimelineWorkWeek';
  private schedulerEventTime: WorkHoursModel;
  private selectedDateResourceScheduler: Date;
  
  private setResourceSchedulerView: View ='TimelineDay';  
  private showResourceScheduler: Boolean = false;
  
  private eventSchedulerObject: EventSettingsModel; 
  private resourceSchedulerObject: EventSettingsModel; 
  private resourceDataSource: Object[];

  private schedulerEvents: SchedulerEvent[];
  private schedulerEventsWithoutDuplicates: SchedulerEvent[];
  private schedulerResources: SchedulerResource[];
  private assignedSchedulerResources: SchedulerResource[];

  private groupData: GroupModel = {
    resources: ['Resources']
 //   allowGroupEdit: true
  };
  

  constructor(
    private schedulerEventService: SchedulerEventService,
    private schedulerResourceService: SchedulerResourceService,
    ) { }

  ngOnInit() {
    //determine scheduler events, remove double entries in case of multiple resources assigned 
    this.getSchedulerEvents()
    
  }

  private getSchedulerEvents(): void {
    this.schedulerEventService.getSchedulerEvents()
      .subscribe(schedulerEvents => { 
        this.schedulerEvents = schedulerEvents
        this.schedulerEventsWithoutDuplicates = schedulerEvents.filter((test, index, array) =>
          index === array.findIndex((findTest) =>
          findTest.Id === test.Id
          )
        );   
        this.eventSchedulerObject  = { dataSource: this.schedulerEventsWithoutDuplicates } 
      })    
    }

    private getSchedulerResources(schedulerEventId: number): void {
    this.schedulerResourceService.getSchedulerResources(schedulerEventId)
      .subscribe(schedulerResources => this.schedulerResources = schedulerResources)
  }

  private onDragStart(args: DragEventArgs): void {
    args.interval = 15;    
    args.excludeSelectors = 'e-all-day-cells'; 
  }

  private onResizeStart(args: ResizeEventArgs): void {
    args.interval = 15;
  }
  
  private onEventClick(args: EventClickArgs): void {  
    //pass all scheduler events including double entries in case of multiple resources
    this.resourceSchedulerObject  = { dataSource: this.schedulerEvents }
    
    //access clicked scheduler event
    //two type casts necessary since args.event cannot be casted directly to SchedulerEvent
    const schedulerEvent = <SchedulerEvent>(args.event as unknown);  
    
    //get all resources with State (assigned, available, blocked) depending on clicked event
    this.getSchedulerResources(schedulerEvent.Id);
    
    //find resources assigned to clicked event 
    this.assignedSchedulerResources = this.schedulerResources.filter(arr=> arr.State === "assigned");
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
