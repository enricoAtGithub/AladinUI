import { Component, OnInit } from '@angular/core';
import {
  View,
  EventSettingsModel,
  TimeScaleModel,
  DragEventArgs,
  ResizeEventArgs,
  GroupModel,
  EventClickArgs,
  ScheduleComponent,
  EJ2Instance,
  WorkHoursModel
} from '@syncfusion/ej2-angular-schedule';

import { SchedulerEventService } from '../../services/scheduler-event.service';
import { SchedulerEvent } from '../../models/scheduler-event';

import { SchedulerResourceService } from '../../services/scheduler-rescource.service';
import { SchedulerResource } from '../../models/scheduler-resource';

import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  // can be removed later (mock data created only for March)
  private selectedDateEventScheduler: Date = new Date(2020, 2, 3);

  private setEventSchedulerView: View = 'TimelineWorkWeek';
  private schedulerEventTime: WorkHoursModel;
  private selectedDateResourceScheduler: Date;

  private setResourceSchedulerView: View = 'TimelineDay';
  private showResourceScheduler: Boolean = false;

  private eventSchedulerObject: EventSettingsModel;
  private resourceSchedulerObject: EventSettingsModel;
  private resourceDataSource: Object[];

  private schedulerEvents: SchedulerEvent[];
  private schedulerResources: SchedulerResource[];

  private resourceFilterItems: MenuItem[];

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

    this.resourceFilterItems = [
      {
        label: 'zugewiesen', icon: 'pi pi-minus', command: () => {
          this.filterDisplayedResources('assigned');
        }
      },
      {
        label: 'verfügbar', icon: 'pi pi-minus', command: () => {
          this.filterDisplayedResources('available');
        }
      },
      {
        label: 'alle', icon: 'pi pi-minus', command: () => {
          this.filterDisplayedResources('all');
        }
      }
    ];
  }

  private filterDisplayedResources(filter: string) {
    this.resourceDataSource = [];
    if (this.schedulerResources) {
      switch (filter) {
        case 'assigned': {
          this.resourceDataSource = this.schedulerResources.filter(arr => arr.State === 'assigned');
          break;
        }
        case 'available': {
          this.resourceDataSource = this.schedulerResources.filter(arr => arr.State === 'available');
          break;
        }
        case 'all': {
          this.resourceDataSource = this.schedulerResources;
          break;
        }
      }
    }
  }

  private getSchedulerEvents(): void {
    this.schedulerEventService.getSchedulerEvents()
      .subscribe(schedulerEvents => {
        this.eventSchedulerObject = { dataSource: schedulerEvents };
      });
  }

  private getSchedulerResourcesAndSchedulerEvents(schedulerEventId: number): void {
    this.schedulerResourceService.getSchedulerResources(schedulerEventId)
      .subscribe(schedulerResources => {
        this.schedulerEvents = [];

        this.schedulerResources = schedulerResources;
        // filter resources assigned to clicked event
        this.filterDisplayedResources('assigned');

        // Ugly workaround since this.schedulerEvents cannot be accessed from inside forEach()
        const thisref = this;

        // Add ResourceID property to schedulerEvents and aggregate ALL schedulerEvents
        // Todo: refactor using flatmap
        schedulerResources.forEach(schResource => {
          schResource.isAssignedTo.forEach(schEvent => {
            schEvent.ResourceID = schResource.Id;
            thisref.schedulerEvents.push(schEvent);
          });
        });

        this.resourceSchedulerObject = { dataSource: this.schedulerEvents };
      });
  }

  private onDragStart(args: DragEventArgs): void {
    args.interval = 15;
    args.excludeSelectors = 'e-all-day-cells';
  }

  private onResizeStart(args: ResizeEventArgs): void {
    args.interval = 15;
  }

  private onEventClick(args: EventClickArgs): void {
    // access clicked scheduler event
    // two type casts necessary since args.event cannot be casted directly to SchedulerEvent
    const schedulerEvent = <SchedulerEvent>(args.event as unknown);

    // get all resources with State (assigned, available, blocked) depending on clicked event
    this.getSchedulerResourcesAndSchedulerEvents(schedulerEvent.Id);

    // Task #1340: show times outside of event time in grey
    const start = <string>(schedulerEvent.StartTime.getHours() as unknown) +
      ':' + <string>(schedulerEvent.StartTime.getMinutes() as unknown);
    const end = <string>(schedulerEvent.EndTime.getHours() as unknown) +
      ':' + <string>(schedulerEvent.EndTime.getMinutes() as unknown);
    // e.g.: schedulerEventTime="{ start: '08:00', end: '9:30' }"
    this.schedulerEventTime = { start: start, end: end };

    this.selectedDateResourceScheduler = schedulerEvent.StartTime;
    this.showResourceScheduler = true;
  }
}
