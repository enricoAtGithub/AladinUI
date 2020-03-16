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
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from '../../../../../breadcrumb.service';
import DateTimeUtils from 'src/app/shared/utils/date-time.utils';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {

  constructor(
    private breadcrumbService: BreadcrumbService,
    private schedulerService: SchedulerService
  ) {
    this.breadcrumbService.setItems([
      { label: 'Einsatzplanung' }
    ]);
  }

  setEventSchedulerView: View = 'TimelineWorkWeek';
  setResourceSchedulerView: View = 'TimelineDay';
  schedulerEventTime: WorkHoursModel;
  selectedDateResourceScheduler: Date;
  showResourceScheduler: Boolean = false;

  eventSchedulerObject: EventSettingsModel;
  resourceSchedulerObject: EventSettingsModel;
  resourceDataSource: Object[];
  resourceFilterItems: MenuItem[] = [];

  private schedulerStatus: {
    currentSchedulerEvent: SchedulerEvent,
    currentResources: SchedulerResource[],
    currentResourceFilter: string
  };

  groupData: GroupModel = {
    resources: ['Resources']
    //   allowGroupEdit: true
  };

  ngOnInit() {
    this.schedulerStatus = { currentSchedulerEvent: null, currentResources: null, currentResourceFilter: null };
    this.getSchedulerEvents();
  }

  private getSchedulerEvents(): void {
    this.schedulerService.getSchedulerEvents()
      .subscribe(schedulerEvents => {
        // provide all schedulerEvents shown in EventScheduler (upper component)
        this.eventSchedulerObject = { dataSource: schedulerEvents };
      });
  }

  onSchedulerEventClick(args: EventClickArgs): void {
    // access clicked scheduler event
    // two type casts necessary since args.event cannot be casted directly to SchedulerEvent
    const schedulerEvent = <SchedulerEvent>(args.event as unknown);

    // set global scheduler status
    this.schedulerStatus = { currentSchedulerEvent: schedulerEvent, currentResources: null, currentResourceFilter: 'assigned' };

    // get all resources with State (assigned, available, blocked) depending on clicked event
    this.getSchedulerResourcesAndSchedulerEvents({ schedulerEvent, filter: 'assigned' });

    // initialize Resource filter
    this.setResourcefilterItems(this.schedulerStatus.currentResources);

    // show times outside of event time in grey
    this.setTimeFrameForCurrentSchedulerEvent(schedulerEvent);

    // show resource scheduler initialized with the date of the current event
    this.selectedDateResourceScheduler = schedulerEvent.StartTime;
    this.showResourceScheduler = true;
  }

  // get resources and events for the Resourcescheduler (at the bottom)
  private getSchedulerResourcesAndSchedulerEvents({ schedulerEvent, filter = 'assigned' }: { schedulerEvent: SchedulerEvent; filter?: string; }): void {
    this.schedulerService.getSchedulerResources(schedulerEvent.Id)
      .subscribe(schedulerResources => {
        // set global scheduler status
        this.schedulerStatus.currentResources = schedulerResources;

        // filter and display resources assigned to clicked event
        this.filterAndDisplayResources({ filter, schedulerResources });

        // modify/enrich scheduler resources server response
        // Todo: refactor using flatmap
        const schedulerEvents: SchedulerEvent[] = [];
        schedulerResources.forEach(schResource => {

          // add custom properties (icons and alternative text)
          schResource.AssignedIcon = this.getIcon({ property: 'Assigned', boolVal: schResource.Assigned });
          schResource.HasConflictIcon = this.getIcon({ property: 'HasConflict', boolVal: schResource.HasConflict });
          schResource.AssignedAltText = this.getAltText({ property: 'Assigned', boolVal: schResource.Assigned });
          schResource.HasConflictAltText = this.getAltText({ property: 'HasConflict', boolVal: schResource.HasConflict });

          // Add ResourceID to each schedulerEvent and aggregate ALL schedulerEvents
          schResource.isAssignedTo.forEach(schEvent => {
            schEvent.ResourceID = schResource.Id;
            schedulerEvents.push(schEvent);
          });
        });

        // provide all schedulerEvents shown in ResourceScheduler (bottom component)
        this.resourceSchedulerObject = { dataSource: schedulerEvents };
      });
  }

  // set filter options in resource scheduler ("Ressourcen filtern")
  private setResourcefilterItems(schedulerResources: SchedulerResource[]): void {
    this.resourceFilterItems = [
      {
        label: 'zugewiesen', icon: 'pi pi-minus', command: () => {
          this.filterAndDisplayResources({ filter: 'assigned', schedulerResources: this.schedulerStatus.currentResources });
        }
      },
      {
        label: 'verfügbar', icon: 'pi pi-minus', command: () => {
          this.filterAndDisplayResources({ filter: 'available', schedulerResources: this.schedulerStatus.currentResources });
        }
      },
    ];
  }

  // determine resources based on filter set in GUI
  private filterAndDisplayResources({ filter, schedulerResources }: { filter: string; schedulerResources: SchedulerResource[]; }): void {
    this.resourceDataSource = [];
    if (schedulerResources) {
      this.schedulerStatus.currentResourceFilter = filter;
      switch (filter) {
        case 'assigned': {
          this.resourceDataSource = schedulerResources.filter(arr => arr.Assigned === true);
          break;
        }
        case 'available': {
          this.resourceDataSource = schedulerResources.filter(arr => arr.Assigned === false);
          break;
        }
      }
    }
  }

  onResizeStop(args: ResizeEventArgs): void {
    this.updateSchedulerEventInterval(<SchedulerEvent>(args.data as unknown));
  }
  onDragStop(args: DragEventArgs): void {
    this.updateSchedulerEventInterval(<SchedulerEvent>(args.data as unknown));
  }

  private updateSchedulerEventInterval(schedulerEvent: SchedulerEvent): void {
    // convert start and end time from Date to String
    const startTime: string = DateTimeUtils.convertDateToApiConformTimeString(schedulerEvent.StartTime);
    const endTime: string = DateTimeUtils.convertDateToApiConformTimeString(schedulerEvent.EndTime);

    this.schedulerService.updateSchedulerEventInterval(schedulerEvent.Id, startTime, endTime)
      .subscribe(temp => {
        // If resourceScheduler is visible update shown resources
        if (this.showResourceScheduler) {
          this.getSchedulerResourcesAndSchedulerEvents({ schedulerEvent: this.schedulerStatus.currentSchedulerEvent, filter: this.schedulerStatus.currentResourceFilter });
          if (schedulerEvent.Id === this.schedulerStatus.currentSchedulerEvent.Id) { this.setTimeFrameForCurrentSchedulerEvent(schedulerEvent); }
        }
        console.log('success');
      });
  }

  private setTimeFrameForCurrentSchedulerEvent(schedulerEvent: SchedulerEvent): void {
    // Task #1340: show times outside of event time in grey
    const start = <string>(schedulerEvent.StartTime.getHours() as unknown) + ':' + <string>(schedulerEvent.StartTime.getMinutes() as unknown);
    const end = <string>(schedulerEvent.EndTime.getHours() as unknown) + ':' + <string>(schedulerEvent.EndTime.getMinutes() as unknown);
    // e.g.: schedulerEventTime="{ start: '08:00', end: '9:30' }"
    this.schedulerEventTime = { start: start, end: end };
  }

  onResizeStart(args: ResizeEventArgs): void {
    args.interval = 15;
  }

  onDragStart(args: DragEventArgs): void {
    args.interval = 15;
    args.excludeSelectors = 'e-all-day-cells';
  }

  // return icon depending on properties "assigned" and "hasConflict"
  private getIcon({ property, boolVal }: { property: string, boolVal: boolean }): string {
    let icon: string;
    switch (property) {
      case ('Assigned'): if (boolVal) { icon = 'pi pi-check'; break; } else { icon = 'pi pi-user-plus'; break; }
      case ('HasConflict'): if (boolVal) { icon = 'pi pi-exclamation-triangle'; } else { icon = ''; }
    }
    return icon;
  }

  // return alternative text depending on properties "assigned" and "hasConflict"
  private getAltText({ property, boolVal }: { property: string, boolVal: boolean }): string {
    let altText: string;
    switch (property) {
      case ('Assigned'): if (boolVal) { altText = 'zugewiesen'; break; } else { altText = 'zuweisen'; break; }
      case ('HasConflict'): if (boolVal) { altText = 'nicht verfügbar'; } else { altText = ''; }
    }
    return altText;
  }

  /* loadConfig(): void {
    let config: Config = require('../../config/scheduler.config.json');
  } */
}
