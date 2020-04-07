import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  View,
  EventSettingsModel,
  DragEventArgs,
  ResizeEventArgs,
  GroupModel,
  EventRenderedArgs
} from '@syncfusion/ej2-angular-schedule';

import { SchedulerService } from '../../services/scheduler.service';
import { BreadcrumbService } from '../../../../../breadcrumb.service';
import DateTimeUtils from 'src/app/shared/utils/date-time.utils';

import { L10n, loadCldr } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/de/ca-gregorian.json';
import * as numbers from 'cldr-data/main/de/numbers.json';
import * as timeZoneNames from 'cldr-data/main/de/timeZoneNames.json';
import de from '../../models/localisation.json';
import { Subscription } from 'rxjs';
import { SchedulerEvent, Absence } from '../../models/scheduler.model';

loadCldr(numberingSystems['default'], gregorian['default'], numbers['default'], timeZoneNames['default']);
L10n.load(de);

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit, OnDestroy {

  availabilitySchedulerObject: EventSettingsModel;
  resourceDataSource: Object[];
  windowHeight: number;

  groupData: GroupModel = { resources: ['Resources'] };

  subscriptions: Subscription[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private schedulerService: SchedulerService

  ) {
    this.breadcrumbService.setItems([
      { label: 'An- & Abwesenheiten' }
    ]);
  }

  ngOnInit() {
    this.getAvailableHeight();
    this.getSchedulerResourcesAndSchedulerEvents(23);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // colorize scheduler events
  onEventRendered(args: EventRenderedArgs): void {
    const color: string = args.data.Color as string;
    const schedulerEventHTML = args.element;
    schedulerEventHTML.style.backgroundColor = color;
  }

  // get resources and events (array isUnavailable)
  private getSchedulerResourcesAndSchedulerEvents(schedulerEventRefId: number): void {
    this.subscriptions.push(
      this.schedulerService.getSchedulerResources(schedulerEventRefId)
        .subscribe(schedulerResources => {
          this.resourceDataSource = schedulerResources;

          const absenceEvents: Absence[] = [];
          schedulerResources.forEach(schResource => {

            // Add ResourceID to each schedulerEvent (type: abscence)
            schResource.IsUnavailable.forEach(absence => {
              absence.ResourceID = schResource.Id;
              absence.IsReadonly = false;
              absenceEvents.push(absence);
            });
          });

          // provide all schedulerEvents shown in ResourceScheduler (bottom component)
          this.availabilitySchedulerObject = { dataSource: absenceEvents };
        }));
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
        })
    );
  }

  public getAvailableHeight(heightTopBar: number = 60, heightRouteBar: number = 32, paddingTop: number = 15, paddingBottom: number = 15, heightFooter: number = 60): void {
    const usedSpace = heightTopBar + heightRouteBar + paddingTop + heightFooter + paddingBottom;
    this.windowHeight = window.innerHeight - usedSpace;
  }

}
