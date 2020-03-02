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
  public showResourceScheduler: Boolean = false;
  public setViewEvents: View;
  public setViewResources: View;  
  
  public scheduleObj: ScheduleComponent;
  
  public groupData: GroupModel = {
    resources: ['Resources']
 //   allowGroupEdit: true
  };
  
 
  constructor(
    private schedulerEventService: SchedulerEventService,
    private schedulerResourceService: SchedulerResourceService,
    ) { }

  ngOnInit() {
    this.setViewEvents = 'TimelineWorkWeek';
    this.getSchedulerEvents();
    this.eventObject  = { dataSource: this.schedulerEvents$ };   
    

    this.getSchedulerResources();
    this.resourceDataSource = this.schedulerResources$;    
  }

  getSchedulerEvents(): void {
    this.schedulerEventService.getSchedulerEvents()
      .subscribe(schedulerEvents => this.schedulerEvents$ = schedulerEvents)
  }

  getSchedulerResources(): void {
    this.schedulerResourceService.getSchedulerResources()
      .subscribe(schedulerResources => this.schedulerResources$ = schedulerResources)
  }

  onDragStart(args: DragEventArgs): void {
    args.interval = 15;    
    args.excludeSelectors = 'e-all-day-cells'; 
  }

  onResizeStart(args: ResizeEventArgs): void {
    //args.scroll.enable = false;
    //args.scroll.scrollBy = 500;
    args.interval = 15;
  }

  onEventClick(args: EventClickArgs): void {  
    
    //Methode getAssignedResourcesForEvent implementieren: 
    //Option a): Backend Service aufrufen
    //Option b): eventObject im Frontend filtern

    //console.log (args);
    this.setViewResources = "TimelineDay";
    this.showResourceScheduler = true;
  }
}
