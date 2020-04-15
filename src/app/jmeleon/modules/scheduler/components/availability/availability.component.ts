import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  View,
  EventSettingsModel,
  DragEventArgs,
  ResizeEventArgs,
  GroupModel,
  EventRenderedArgs,
  PopupOpenEventArgs
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
import { Subscription, Observable } from 'rxjs';
import { Availability } from '../../models/availability.model';
import { ContextMenuSettings, AvailabiltySchedulerSettings } from '../../config/scheduler.config';
import { DialogService, ConfirmationService, MenuItem } from 'primeng/api';
import { EntityService } from 'src/app/shared/services/entity.service';
import { EntityDialogComponent } from 'src/app/shared/components/entity-dialog/entity-dialog.component';
import { ContextMenu } from 'primeng/contextmenu';

loadCldr(numberingSystems['default'], gregorian['default'], numbers['default'], timeZoneNames['default']);
L10n.load(de);

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css'],
  providers: [ConfirmationService]
})
export class AvailabilityComponent implements OnInit, OnDestroy {

  availabilitySchedulerObject: EventSettingsModel;
  resourceDataSource: Object[];
  windowHeight: number;
  initialView: View;
  contextMenuOpen: boolean;

  groupData: GroupModel = { resources: ['Resources'] };

  subscriptions: Subscription[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private availabilityService: AvailabilityService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private entityService: EntityService

  ) {
    this.breadcrumbService.setItems([
      { label: 'An- & Abwesenheiten' }
    ]);
  }

  ngOnInit() {
    this.initialView = <View>AvailabiltySchedulerSettings.initialView;
    this.getAvailableHeight();
    this.getResourceAvailabilities();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // colorize scheduler events
  onEventRendered(args: EventRenderedArgs): void {
    const color: string = args.data.Color as string;
    const availabilityHTML = args.element;
    availabilityHTML.style.backgroundColor = color;
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

  // https://stackoverflow.com/questions/43590487/open-the-context-menu-by-primeng-from-code-angular-2?rq=1
  openContextMenu(availCM: ContextMenu, event: MouseEvent, data: Availability): void {
    this.contextMenuOpen = true;
    const model: MenuItem[] = [];
    model.push(
      {
        label: ContextMenuSettings.iconText.edit,
        icon: ContextMenuSettings.icons.edit,
        command: () => { this.updateAvailability(data); },
      },
      {
        label: ContextMenuSettings.iconText.delete,
        icon: ContextMenuSettings.icons.delete,
        command: () => { this.deleteAvailability(data); },
      }

    );
    availCM.model = model;
    availCM.show(event);
  }

  closeContextMenu() {
    this.contextMenuOpen = false;
  }

  updateAvailability(data: Availability) {
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: true,
        entityId: data.RefId,
        configName: 'ResourceAvailability'
      },
      header: data['Subject'] + ' bearbeiten',
      width: '500px'
    });

    dialogRef.onClose.subscribe((result: Observable<Object>) => {
      if (result !== undefined) {
        this.subscriptions.push(
          result.subscribe(() => {
            this.getResourceAvailabilities();
          })
        );
      }
    });
  }

  addAvailability(data: any) {
    if (this.contextMenuOpen) { return; }
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: false,
        entity: { startDate: data.startTime, endDate: data.endTime, resourceId: data.ResourceID },
        configName: 'ResourceAvailability'
      },
      header: 'Eintrag erstellen',
      width: '500px'
    });

    dialogRef.onClose.subscribe((result: Observable<Object>) => {
      if (result !== undefined) {
        this.subscriptions.push(
          result.subscribe(() => this.getResourceAvailabilities())
        );
      }
    });
  }

  deleteAvailability(data: Availability) {
    this.confirmationService.confirm({
      message: 'Sind Sie sicher, dass Sie diesen Eintrag löschen wollen?',
      accept: () => {
        this.subscriptions.push(
          this.entityService.deleteEntity('ResourceAvailability', data['RefId']).subscribe(() => {
            this.getResourceAvailabilities();
          })
        );
      }
    });
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor' || args.type === 'QuickInfo') {
      args.cancel = true;
    }
  }

}
