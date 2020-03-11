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

import { SchedulerService } from '../../services/scheduler.service';
import { SchedulerEvent } from '../../models/scheduler-event';

import { SchedulerResource } from '../../models/scheduler-resource';

import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from '../../../../../breadcrumb.service';
import { DateTimeService } from 'src/app/shared/services/date-time.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  // can be removed later (mock data created only for March)
  private selectedDateEventScheduler: Date = new Date(2020, 1, 3);

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

  private currentSchedulerEventId: number;
  private schedulerStatus: { currentSchedulerEventId: number, currentResourceFilter: string };

  private groupData: GroupModel = {
    resources: ['Resources']
    //   allowGroupEdit: true
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private schedulerService: SchedulerService
  ) {
    this.breadcrumbService.setItems([
      { label: 'Einsatzplanung' }
    ]);
  }

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
      this.schedulerStatus.currentResourceFilter = filter;
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
    this.schedulerStatus = { currentSchedulerEventId: null, currentResourceFilter: 'assigned' };

    this.schedulerService.getSchedulerEvents()
      .subscribe(schedulerEvents => {
        this.eventSchedulerObject = { dataSource: schedulerEvents };
      });
  }

  private getSchedulerResourcesAndSchedulerEvents(schedulerEventId: number, filter = 'assigned'): void {
    this.schedulerStatus = { currentSchedulerEventId: schedulerEventId, currentResourceFilter: filter };

    this.schedulerService.getSchedulerResources(schedulerEventId)
      .subscribe(schedulerResources => {
        this.schedulerEvents = [];

        this.schedulerResources = schedulerResources;
        // filter resources assigned to clicked event
        this.filterDisplayedResources(filter);

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

  // Resizing is buggy
  private onResizeStart(args: ResizeEventArgs): void {
    args.interval = 15;
  }

  // Resizing is buggy
  private onResizeStop(args: ResizeEventArgs): void {
    // temporary until refresh ist correctly implemented
    // this.showResourceScheduler = false;
    this.updateSchedulerEventInterval(<SchedulerEvent>(args.data as unknown));
  }

  private onDragStop(args: DragEventArgs): void {
    // temporary until refresh ist correctly implemented
    // this.showResourceScheduler = false;

    this.updateSchedulerEventInterval(<SchedulerEvent>(args.data as unknown));
  }

  private updateSchedulerEventInterval(schedulerEvent: SchedulerEvent) {
    // convert start and end time from Date to String
    const startTime: string = DateTimeService.convertDateToApiConformTimeString(schedulerEvent.StartTime);
    const endTime: string = DateTimeService.convertDateToApiConformTimeString(schedulerEvent.EndTime);
    console.log('Start: ' + startTime + ' | Ende: ' + endTime);
    this.schedulerService.updateSchedulerEventInterval(schedulerEvent.Id, startTime, endTime)
      .subscribe(temp => {
        // If resourceScheduler is visible update shown resources
        if (this.showResourceScheduler) {
          // tslint:disable-next-line: max-line-length
          this.getSchedulerResourcesAndSchedulerEvents(this.schedulerStatus.currentSchedulerEventId, this.schedulerStatus.currentResourceFilter);
        }
        console.log('success');
      });

  }

  private onEventClick(args: EventClickArgs): void {
    // access clicked scheduler event
    // two type casts necessary since args.event cannot be casted directly to SchedulerEvent
    const schedulerEvent = <SchedulerEvent>(args.event as unknown);

    // get all resources with State (assigned, available, blocked) depending on clicked event
    this.getSchedulerResourcesAndSchedulerEvents(schedulerEvent.Id, 'assigned');

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
