import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  View,
  EventSettingsModel,
  DragEventArgs,
  ResizeEventArgs,
  GroupModel,
  EventRenderedArgs
} from '@syncfusion/ej2-angular-schedule';

import { AvailabilityService } from '../../services/availability.service';
import { BreadcrumbService } from '../../../../../breadcrumb.service';
import DateTimeUtils from 'src/app/shared/utils/date-time.utils';

import { L10n, loadCldr } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/de/ca-gregorian.json';
import * as numbers from 'cldr-data/main/de/numbers.json';
import * as timeZoneNames from 'cldr-data/main/de/timeZoneNames.json';
import de from '../../config/translations.json';
import { Subscription } from 'rxjs';
import { Availability } from '../../models/availability.model';
import { availabiltySchedulerSettings } from '../../config/scheduler.config';

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
  initialView: View;

  groupData: GroupModel = { resources: ['Resources'] };

  subscriptions: Subscription[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private availabilityService: AvailabilityService

  ) {
    this.breadcrumbService.setItems([
      { label: 'An- & Abwesenheiten' }
    ]);
  }

  ngOnInit() {
    this.initialView = <View>availabiltySchedulerSettings.initialView;
    this.getAvailableHeight();
    this.getResourceAvailabilities();
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

  getResourceAvailabilities() {
    this.availabilityService.getResourceAvailabilities()
      .subscribe(resources => {
        this.resourceDataSource = resources;
        const availabilityEvents: Availability[] = [];

        resources.forEach(resource => {
          // Add ResourceID to each availability
          resource.Availabilities.forEach(availability => {
            availability.ResourceID = resource.Id;
            availabilityEvents.push(availability);
          });
        });

        // provide all availabilities
        this.availabilitySchedulerObject = { dataSource: availabilityEvents };
      });
  }

  setResizeParams(args: ResizeEventArgs): void {
    args.interval = 15;
  }

  setDraggingParams(args: DragEventArgs): void {
    args.interval = 15;
    args.excludeSelectors = 'e-all-day-cells';
  }

  updateAvailabilityInterval(args: any): void {
    // allow drag & drop only within the same resource
    if (args.name === 'dragStop') {
      const rootElement = <HTMLElement>args.event.element;
      const targetElement = <HTMLElement>args.event.target;
      if (rootElement.dataset.groupIndex !== targetElement.dataset.groupIndex) { args.cancel = true; }
    }

    const availabilityEvent = <Availability>(args.data as any);
    // convert start and end time from Date to String
    const startDateTime: string = DateTimeUtils.convertDateToApiConformTimeString(availabilityEvent.StartTime);
    const endDateTime: string = DateTimeUtils.convertDateToApiConformTimeString(availabilityEvent.EndTime);

    this.subscriptions.push(
      this.availabilityService.updateAvailabilityInterval(availabilityEvent.RefId, startDateTime, endDateTime)
        .subscribe(() => {
        })
    );
  }

  public getAvailableHeight(heightTopBar: number = 60, heightRouteBar: number = 32, paddingTop: number = 15, paddingBottom: number = 15, heightFooter: number = 60): void {
    const usedSpace = heightTopBar + heightRouteBar + paddingTop + heightFooter + paddingBottom;
    this.windowHeight = window.innerHeight - usedSpace;
  }

}
