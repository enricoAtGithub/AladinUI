import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  View,
  EventSettingsModel,
  DragEventArgs,
  ResizeEventArgs,
  GroupModel,
  EventClickArgs,
  WorkHoursModel,
  EventRenderedArgs
} from '@syncfusion/ej2-angular-schedule';

import { SchedulerService } from '../../services/scheduler.service';
import { SelectItem } from 'primeng/api';
import { BreadcrumbService } from '../../../../../breadcrumb.service';
import DateTimeUtils from 'src/app/shared/utils/date-time.utils';

import { L10n, loadCldr } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/de/ca-gregorian.json';
import * as numbers from 'cldr-data/main/de/numbers.json';
import * as timeZoneNames from 'cldr-data/main/de/timeZoneNames.json';
import de from '../../config/translations.json';
import { Subscription } from 'rxjs';
import { SchedulerEvent, SchedulerResource } from '../../models/scheduler.model';
import { eventSchedulerSettings, resourceSchedulerSettings } from '../../config/scheduler.config';

loadCldr(numberingSystems['default'], gregorian['default'], numbers['default'], timeZoneNames['default']);
L10n.load(de);

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit, OnDestroy {

  windowHeight: number;
  eventSchedulerHeight: number;
  resourceSchedulerHeight: number;
  eventSchedulerView: View;
  resourceSchedulerView: View;
  schedulerEventTime: WorkHoursModel;
  selectedDateResourceScheduler: Date;
  eventSchedulerObject: EventSettingsModel;
  resourceSchedulerObject: EventSettingsModel;
  resourceDataSource: Object[];
  currentResourceFilter: string[] = [];
  resourceFilter: SelectItem[];
  subscriptions: Subscription[] = [];
  private schedulerStatus: {
    currentSchedulerEvent: SchedulerEvent,
    currentResources: SchedulerResource[],
  };

  showResourceScheduler = false;
  groupData: GroupModel = { resources: ['Resources'] };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private schedulerService: SchedulerService

  ) {
    this.breadcrumbService.setItems([
      { label: 'Einsatzplanung' }
    ]);
  }

  ngOnInit() {
    this.eventSchedulerView = <View>eventSchedulerSettings.initialView;
    this.resourceSchedulerView = <View>resourceSchedulerSettings.initialView;
    this.resourceFilter = [
      { label: resourceSchedulerSettings.filterText.assigned, value: 'assigned' },
      { label: resourceSchedulerSettings.filterText.available, value: 'available' },
      { label: resourceSchedulerSettings.filterText.hasConflict, value: 'hasConflict' }
    ];
    this.schedulerStatus = { currentSchedulerEvent: null, currentResources: null };
    this.getSchedulerHeights();
    this.getSchedulerEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // colorize scheduler events
  onEventRendered(args: EventRenderedArgs): void {
    const color: string = args.data.Color as string;
    const schedulerEventHTML = args.element;
    schedulerEventHTML.style.backgroundColor = color;

    // on resource scheduler add css class "selected" to the current scheduler event
    if (this.schedulerStatus.currentSchedulerEvent && (args.data.Id === this.schedulerStatus.currentSchedulerEvent.Id)) {
      schedulerEventHTML.classList.add('selected');
    }
  }

  private getSchedulerEvents(): void {
    this.subscriptions.push(
      this.schedulerService.getSchedulerEvents()
        .subscribe(schedulerEvents => {
          // provide all schedulerEvents shown in EventScheduler (upper component)
          this.eventSchedulerObject = { dataSource: schedulerEvents };
        }));
  }

  onSchedulerEventClick(args: EventClickArgs): void {
    // access clicked scheduler event
    const schedulerEvent = <SchedulerEvent>(args.event as unknown);

    // set global scheduler status
    this.schedulerStatus = { currentSchedulerEvent: schedulerEvent, currentResources: null };

    // set resource file: If no resources are assigned show also available resources
    if (<number>schedulerEvent.AssignedResources > 0) {
      this.currentResourceFilter = ['assigned'];
    } else {
      this.currentResourceFilter = ['assigned', 'available'];
    }

    // get all resources with State (assigned, available, blocked) depending on clicked event
    this.getSchedulerResourcesAndSchedulerEvents({ schedulerEvent: schedulerEvent, filter: this.currentResourceFilter });

    // show times outside of event time in grey
    this.setTimeFrameForCurrentSchedulerEvent(schedulerEvent);

    // show resource scheduler initialized with the date of the current event
    this.selectedDateResourceScheduler = schedulerEvent.StartTime;
    this.showResourceScheduler = true;
  }

  // get resources and events for the Resourcescheduler (at the bottom)
  private getSchedulerResourcesAndSchedulerEvents({ schedulerEvent, filter }: { schedulerEvent: SchedulerEvent; filter: string[]; }): void {
    this.subscriptions.push(
      this.schedulerService.getSchedulerResources(schedulerEvent.RefId)
        .subscribe(schedulerResources => {
          // set global scheduler status
          this.schedulerStatus.currentResources = schedulerResources;

          // filter and display resources assigned to clicked event
          this.filterAndDisplayResources(filter);

          // modify/enrich scheduler resources server response
          const schedulerEvents: SchedulerEvent[] = [];
          schedulerResources.forEach(schResource => {

            // add custom properties (icons and alternative text)
            schResource.AssignedIcon = schResource.Assigned ? resourceSchedulerSettings.icons.unassign : resourceSchedulerSettings.icons.assign;
            schResource.AssignedAltText = schResource.Assigned ? resourceSchedulerSettings.iconText.unassign : resourceSchedulerSettings.iconText.assign;
            schResource.HasConflictIcon = schResource.HasConflict ? resourceSchedulerSettings.icons.hasConflict : '';
            schResource.HasConflictAltText = schResource.HasConflict ? resourceSchedulerSettings.iconText.hasConflict : '';

            // Add ResourceID to each schedulerEvent (type: order) and aggregate ALL schedulerEvents
            schResource.IsAssignedTo.forEach(schEvent => {
              schEvent.ResourceID = schResource.Id;
              schedulerEvents.push(schEvent);
            });

            // Add ResourceID to each schedulerEvent (type: abscence)
            schResource.IsUnavailable.forEach(absence => {
              absence.ResourceID = schResource.Id;
              absence.AssignedResources = 1;
              absence.MissingResources = null;
              absence.TooManyResources = null;
              absence.ResourceConflictDescription = null;
              schedulerEvents.push(absence);
            });
          });

          // provide all schedulerEvents shown in ResourceScheduler (bottom component)
          this.resourceSchedulerObject = { dataSource: schedulerEvents };
        }));
  }

  filterAndDisplayResources(filter: string[]): void {
    this.resourceDataSource = [];
    if (this.schedulerStatus.currentResources) {
      const isAssigned = (schRes: SchedulerResource) => schRes.Assigned;
      const isAvailable = (schRes: SchedulerResource) => !schRes.Assigned && !schRes.HasConflict;
      const hasConflict = (schRes: SchedulerResource) => !schRes.Assigned && schRes.HasConflict;

      this.resourceDataSource = this.schedulerStatus.currentResources.filter(schRes =>
        (filter.includes('assigned') && isAssigned(schRes)) ||
        (filter.includes('available') && isAvailable(schRes)) ||
        (filter.includes('hasConflict') && hasConflict(schRes))
      );

      // sorting: Prio 1: assigned resources Prio 2: name
      this.resourceDataSource.sort((schRes1: SchedulerResource, schRes2: SchedulerResource) => {
        if (schRes1.Assigned && !schRes2.Assigned) { return -1; }
        if (schRes2.Assigned && !schRes1.Assigned) { return 1; }
        if (schRes1.Name < schRes2.Name) { return -1; }
        if (schRes1.Name > schRes2.Name) { return 1; }
        return 0;
      });
    }
  }

  // assign or unassign resources
  modifyAssignment(schedulerResource: SchedulerResource) {
    if (schedulerResource.Assigned) {
      this.subscriptions.push(
        this.schedulerService.removeResourceFromSchedulerEvent(this.schedulerStatus.currentSchedulerEvent.RefId, schedulerResource.Id)
          .subscribe(() => this.getSchedulerResourcesAndSchedulerEvents({ schedulerEvent: this.schedulerStatus.currentSchedulerEvent, filter: this.currentResourceFilter }))
      );
    } else if (!schedulerResource.Assigned) {
      this.subscriptions.push(
        this.schedulerService.assignResourceToSchedulerEvent(this.schedulerStatus.currentSchedulerEvent.RefId, schedulerResource.Id)
          .subscribe(() => this.getSchedulerResourcesAndSchedulerEvents({ schedulerEvent: this.schedulerStatus.currentSchedulerEvent, filter: this.currentResourceFilter }))
      );
    }
  }

  setResizeParams(args: ResizeEventArgs): void {
    args.interval = 15;
  }

  setDraggingParams(args: DragEventArgs): void {
    args.interval = 15;
    args.excludeSelectors = 'e-all-day-cells';
  }

  updateSchedulerEventInterval(schedulerEvent: SchedulerEvent): void {
    // convert start and end time from Date to String
    const startDateTime: string = DateTimeUtils.convertDateToApiConformTimeString(schedulerEvent.StartTime);
    const endDateTime: string = DateTimeUtils.convertDateToApiConformTimeString(schedulerEvent.EndTime);

    // update time frame (shown in scheduler event)
    schedulerEvent.TimeFrameStr = this.schedulerService.getTimeframeAsString(schedulerEvent.StartTime, schedulerEvent.EndTime);

    this.subscriptions.push(
      this.schedulerService.updateSchedulerEventInterval(schedulerEvent.RefId, startDateTime, endDateTime)
        .subscribe(() => {
          // If resourceScheduler is visible update shown resources
          if (this.showResourceScheduler) {
            this.getSchedulerResourcesAndSchedulerEvents({ schedulerEvent: this.schedulerStatus.currentSchedulerEvent, filter: this.currentResourceFilter });
            if (schedulerEvent.RefId === this.schedulerStatus.currentSchedulerEvent.RefId) { this.setTimeFrameForCurrentSchedulerEvent(schedulerEvent); }
          }
        })
    );
  }

  private setTimeFrameForCurrentSchedulerEvent(schedulerEvent: SchedulerEvent): void {
    // Task #1340: show times outside of event time in grey
    // refactor: https://ej2.syncfusion.com/angular/documentation/schedule/cell-customization/#using-template
    const start = <string>(schedulerEvent.StartTime.getHours() as unknown) + ':' + <string>(schedulerEvent.StartTime.getMinutes() as unknown);
    const end = <string>(schedulerEvent.EndTime.getHours() as unknown) + ':' + <string>(schedulerEvent.EndTime.getMinutes() as unknown);
    // e.g.: schedulerEventTime="{ start: '08:00', end: '9:30' }"
    this.schedulerEventTime = { start: start, end: end };
  }

  resizeSchedulers(args: any) {
    if (<number>(args.sizes[0])) {
      this.eventSchedulerHeight = <number>(args.sizes[0]);
      this.resourceSchedulerHeight = this.windowHeight - this.eventSchedulerHeight - 70;

    }
  }

  getSchedulerHeights() {
    this.windowHeight = this.getAvailableHeight();
    // calculate space for the two schedulers.
    // subtract occupied space between the 2 schedulers (split gutter, margin and multiselect = 62px)
    this.eventSchedulerHeight = ((this.windowHeight - 62) * 1 / 3);
    this.resourceSchedulerHeight = ((this.windowHeight - 62) * 2 / 3);
  }

  private getAvailableHeight(heightTopBar: number = 60, heightRouteBar: number = 32, paddingTop: number = 15, paddingBottom: number = 15, heightFooter: number = 60): number {
    const usedSpace = heightTopBar + heightRouteBar + paddingTop + heightFooter + paddingBottom;
    const usableHeight = window.innerHeight - usedSpace;
    return (usableHeight);
  }

  /* loadConfig(): void {
    let config: Config = require('../../config/scheduler.config.json');
  } */
}
