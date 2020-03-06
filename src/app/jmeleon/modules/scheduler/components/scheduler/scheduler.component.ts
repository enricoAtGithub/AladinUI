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

  public schedulerEvents: SchedulerEvent[] =[];
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
    this.getSchedulerEvents();    
  }

  private getSchedulerEvents(): void {
    this.schedulerEventService.getSchedulerEvents()
      .subscribe(schedulerEvents => { 
        this.eventSchedulerObject = { dataSource: schedulerEvents }        
      })    
    }

  private getSchedulerResourcesAndSchedulerEvents(schedulerEventId: number): void {
    this.schedulerResourceService.getSchedulerResources(schedulerEventId)
      .subscribe(schedulerResources => {
        //filter resources assigned to clicked event 
        this.resourceDataSource = schedulerResources.filter(arr=> arr.State === "assigned"); 
        const thisref = this;

        schedulerResources.forEach(schResource => {
          schResource.isAssignedTo.forEach(schEvent => {
            schEvent.ResourceID = schResource.Id  
            //SchedulerComponent.prototype.schedulerEvents.push(schEvent);          
            thisref.schedulerEvents.push(schEvent)
          });
          
        });

        console.log(this.schedulerEvents);
        //this.resourceSchedulerObject = { dataSource: this.schedulerEvents };
        //this.resourceSchedulerObject = { dataSource: schedulerResources[1].isAssignedTo};

        //console.log(schedulerResources[1].isAssignedTo);
        //console.log(this.schedulerEvents)
      })
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
    
    
    
    
    //access clicked scheduler event
    //two type casts necessary since args.event cannot be casted directly to SchedulerEvent
    const schedulerEvent = <SchedulerEvent>(args.event as unknown);  
    
    //get all resources with State (assigned, available, blocked) depending on clicked event
    this.getSchedulerResourcesAndSchedulerEvents(schedulerEvent.Id);
    
    
        
    //Task #1340: show times outside of event time in grey
    const start = <string>(schedulerEvent.StartTime.getHours() as unknown) + ":" + <string>(schedulerEvent.StartTime.getMinutes() as unknown);
    const end = <string>(schedulerEvent.EndTime.getHours() as unknown) + ":" + <string>(schedulerEvent.EndTime.getMinutes() as unknown);
    // e.g.: schedulerEventTime="{ start: '08:00', end: '9:30' }"
    this.schedulerEventTime = { start: start, end: end };

    this.selectedDateResourceScheduler = schedulerEvent.StartTime;
    this.showResourceScheduler = true;  
  }
}
