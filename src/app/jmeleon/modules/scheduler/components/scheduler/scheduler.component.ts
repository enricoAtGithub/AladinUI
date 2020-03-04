import { Component, OnInit } from '@angular/core';
import { View, EventSettingsModel, TimeScaleModel, DragEventArgs, ResizeEventArgs, GroupModel, EventClickArgs, ScheduleComponent, EJ2Instance } from '@syncfusion/ej2-angular-schedule';

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
  //Wann public, wann private, wann nix von beidem?
  public eventObject: EventSettingsModel; 
  public resourceDataSource: Object[]; 
  public schedulerEvents$: SchedulerEvent[];
  
  public schedulerResources$: SchedulerResource[];
  public assignedSchedulerResources: SchedulerResource[];

  public showResourceScheduler: Boolean = false;
  public setEventsView: View = 'TimelineWorkWeek';
  public selectedDateEventsView: Date = new Date(2020,2,3);
  
  public setResourcesView: View ='TimelineDay';  
  public selectedDateRessourcesView: Date;

  //public scheduleObj: Object;

  public groupData: GroupModel = {
    resources: ['Resources']
 //   allowGroupEdit: true
  };
  
 
  constructor(
    private schedulerEventService: SchedulerEventService,
    private schedulerResourceService: SchedulerResourceService,
    ) { }

  ngOnInit() {
    this.getSchedulerEvents();
    this.eventObject  = { dataSource: this.schedulerEvents$ };           
  }

  getSchedulerEvents(): void {
    this.schedulerEventService.getSchedulerEvents()
      .subscribe(schedulerEvents => this.schedulerEvents$ = schedulerEvents)
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
    //access clicked scheduler event
    //2 type casts necessary since args.event cannot be casted directly to SchedulerEvent
    const schedulerEvent = <SchedulerEvent>(args.event as unknown);       
    
    //get all resources with State (assigned, available, blocked) depending on clicked event
    this.getSchedulerResources(schedulerEvent.Id);
    
    //filter resources assigned to clicked event 
    this.assignedSchedulerResources = this.schedulerResources$.filter(arr=> arr.State === "assigned");
    this.resourceDataSource = this.assignedSchedulerResources;  
    
    this.selectedDateRessourcesView = schedulerEvent.StartTime;    
    this.showResourceScheduler = true;  
  }
}
