import { Component, OnInit, OnDestroy } from '@angular/core';
import { root } from 'src/app/jmeleon/modules/permissions/permissions';
import {
  View,
  EventSettingsModel,
  DragEventArgs,
  ResizeEventArgs,
  GroupModel,
  EventClickArgs,
  WorkHoursModel,
  EventRenderedArgs,
  PopupOpenEventArgs,
  NavigatingEventArgs
} from '@syncfusion/ej2-angular-schedule';

import { SchedulerService } from '../../services/scheduler.service';
import { SelectItem, DialogService, ConfirmationService, MenuItem } from 'primeng/api';
import { BreadcrumbService } from '../../../../../breadcrumb.service';
import DateTimeUtils from 'src/app/shared/utils/date-time.utils';

import { L10n, loadCldr } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as gregorian from 'cldr-data/main/de/ca-gregorian.json';
import * as numbers from 'cldr-data/main/de/numbers.json';
import * as timeZoneNames from 'cldr-data/main/de/timeZoneNames.json';
import de from '../../config/translations.json';
import { Subscription, Observable } from 'rxjs';
import { SchedulerEvent, SchedulerResource } from '../../models/scheduler.model';
import { EventSchedulerSettings, ResourceSchedulerSettings, ContextMenuSettings } from '../../config/scheduler.config';
import { EntityDialogComponent } from 'src/app/shared/components/entity-dialog/entity-dialog.component';
import { EntityService } from 'src/app/shared/services/entity.service';
import { EntityConfiguration } from 'src/app/shared/models/entity-configuration';
import { ContextMenu } from 'primeng/contextmenu';
import { ResizeEvent } from 'angular-resizable-element';
import { SchedulerTimeRange, TimeRange } from '../../config/scheduler.timerange';
import { JmeleonActionsPermissionService } from '../../../permissions/services/jmeleon-actions-permission.service';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromConfigSelectors from 'src/app/root-store/config-store/config.selectors';

loadCldr(numberingSystems['default'], gregorian['default'], numbers['default'], timeZoneNames['default']);
L10n.load(de);

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
  providers: [ConfirmationService]
})
export class SchedulerComponent implements OnInit, OnDestroy {

  lastResize = Date.now();
  boxHeights: number[];
  windowHeight: number;
  eventSchedulerHeight: number;
  resourceSchedulerHeight: number;
  eventSchedulerView: View;
  resourceSchedulerView: View;
  schedulerEventTime: WorkHoursModel;
  selectedDateResourceScheduler: Date;
  showResourceScheduler = false;

  eventSchedulerObject: EventSettingsModel;
  resourceSchedulerObject: EventSettingsModel;
  resourceDataSource: Object[];
  currentResourceFilter: string[] = [];
  resourceFilter: SelectItem[];
  subscriptions: Subscription[] = [];
  schEvConfig: EntityConfiguration;
  private schedulerStatus: {
    currentSchedulerEvent: SchedulerEvent,
    currentEvSchedulerEventHTML: HTMLElement,
    currentResSchedulerEventHTML: HTMLElement,
    currentResources: SchedulerResource[],
    contextMenuOpen: boolean
  };
  private currEvSchInterval: { currDate: Date, currView: View };
  private currResSchInterval: { currDate: Date, currView: View };
  groupData: GroupModel = { resources: ['Resources'] };
  configuration: EntityConfiguration;

  tooltipTemplate: string = '<div style="margin: 2px;font-size:12px;">' +
    '<div class="content-area">' +
    '<div class="name"><b>${Subject}</></b></div>' +
    '${if(Type !== "unbekannt")}<div class="type">Auftragsart:&nbsp;${Type}</div>${/if}' +
    '${if(Location != null)}<div class="location">Einsatzort:&nbsp;${Location}</div>${/if}' +
    '<div class="time">Start:&nbsp;${StartTime.toLocaleString()}</div>' +
    '<div class="time">Ende:&nbsp;${EndTime.toLocaleString()}</div>' +
    '</div>' +
    '</div>';

  // variables required for security
  root = root;
  permissionsRecord$: Observable<Record<string, boolean>>;
  private permissionsRecord: Record<string, boolean>;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private schedulerService: SchedulerService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private entityService: EntityService,
    private japs: JmeleonActionsPermissionService,
    private store$: Store<RootStoreState.State>,
  ) {
    this.breadcrumbService.setItems([
      { label: 'Einsatzplanung' }
    ]);
    this.initPermissions();
  }

  ngOnInit() {
    this.initMemberVars();
    this.getSchedulerHeights();
    this.getSchedulerEvents(SchedulerTimeRange.get(this.currEvSchInterval.currView).getRange(this.currEvSchInterval.currDate));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initPermissions() {
    this.permissionsRecord$ = this.japs.userHasPermissionForActions([root.dto.Order.create, root.dto.Order.write, root.dto.Order.delete, root.Scheduler.order.updateInterval]);
    this.subscriptions.push(this.permissionsRecord$.subscribe(record => this.permissionsRecord = record));
  }

  private initMemberVars() {
    this.eventSchedulerView = <View>EventSchedulerSettings.initialView;
    this.resourceSchedulerView = <View>ResourceSchedulerSettings.initialView;
    this.resourceFilter = [
      { label: ResourceSchedulerSettings.filterText.assigned, value: 'assigned' },
      { label: ResourceSchedulerSettings.filterText.available, value: 'available' },
      { label: ResourceSchedulerSettings.filterText.hasConflict, value: 'hasConflict' }
    ];
    this.schedulerStatus = { currentSchedulerEvent: null, currentEvSchedulerEventHTML: null, currentResSchedulerEventHTML: null, currentResources: null, contextMenuOpen: false };
    this.currEvSchInterval = { currView: this.eventSchedulerView, currDate: new Date() };
    this.subscriptions.push(this.store$.pipe(select(fromConfigSelectors.selectConfigs), map(configs => configs['Order'])).subscribe(config => this.configuration = config));
  }

  onEventRendered(args: EventRenderedArgs, schedulerType: string): void {
    const color: string = args.data.Color as string;
    const schedulerEventHTML = <HTMLElement>args.element;
    schedulerEventHTML.style.backgroundColor = color;

    // add css class "selected" to the current scheduler event
    if (this.schedulerStatus.currentSchedulerEvent && (args.data.Id === this.schedulerStatus.currentSchedulerEvent.Id)) {
      schedulerEventHTML.classList.add('selected');
      if (schedulerType === 'evSch') { this.schedulerStatus.currentEvSchedulerEventHTML = schedulerEventHTML; }
      else if (schedulerType === 'resSch') { this.schedulerStatus.currentResSchedulerEventHTML = schedulerEventHTML; }
    }
  }


  private getSchedulerEvents(timeRange: TimeRange): void {
    const start: string = DateTimeUtils.convertDateToApiConformTimeString(timeRange.start);
    const end: string = DateTimeUtils.convertDateToApiConformTimeString(timeRange.end);
    this.subscriptions.push(
      this.schedulerService.getSchedulerEvents({ start, end })
        .subscribe(schedulerEvents => {
          // provide all schedulerEvents shown in EventScheduler (upper component)
          this.eventSchedulerObject = { dataSource: schedulerEvents, enableTooltip: true, tooltipTemplate: this.tooltipTemplate };
        }));
  }

  onSchedulerEventClick(args: EventClickArgs): void {
    // access clicked scheduler event 
    const schedulerEvent = <SchedulerEvent>(args.event as unknown);

    // remove frame of previously selected event
    if (this.schedulerStatus.currentEvSchedulerEventHTML) { this.schedulerStatus.currentEvSchedulerEventHTML.classList.remove('selected'); }
    // add frame to clicked event
    const schedulerEventHTML = <HTMLElement>args.element;
    schedulerEventHTML.classList.add('selected');

    // set global scheduler status
    this.schedulerStatus = { currentSchedulerEvent: schedulerEvent, currentEvSchedulerEventHTML: schedulerEventHTML, currentResSchedulerEventHTML: null, currentResources: null, contextMenuOpen: false };
    this.currResSchInterval = { currView: this.resourceSchedulerView, currDate: schedulerEvent.StartTime };

    // set resource file: If no resources are assigned show also available resources
    if (<number>schedulerEvent.AssignedResources > 0) {
      this.currentResourceFilter = ['assigned'];
    } else {
      this.currentResourceFilter = ['assigned', 'available'];
    }

    // get all resources with State (assigned, available, blocked) depending on clicked event
    this.getSchedulerResourcesAndSchedulerEvents(
      { schedulerEvent: schedulerEvent, filter: this.currentResourceFilter },
      SchedulerTimeRange.get(this.currResSchInterval.currView).getRange(this.currResSchInterval.currDate)
    );

    // show times outside of event time in grey
    this.setTimeFrameForCurrentSchedulerEvent(schedulerEvent);

    // show resource scheduler initialized with the date of the current event
    this.selectedDateResourceScheduler = schedulerEvent.StartTime;
    this.showResourceScheduler = true;
  }

  // get resources and events for the Resourcescheduler (at the bottom)
  private getSchedulerResourcesAndSchedulerEvents({ schedulerEvent, filter }: { schedulerEvent: SchedulerEvent; filter: string[]; }, timeRange: TimeRange): void {
    const start: string = DateTimeUtils.convertDateToApiConformTimeString(timeRange.start);
    const end: string = DateTimeUtils.convertDateToApiConformTimeString(timeRange.end);

    this.subscriptions.push(
      this.schedulerService.getSchedulerResources(schedulerEvent.RefId, { start, end })
        .subscribe(schedulerResources => {
          // set global scheduler status
          this.schedulerStatus.currentResources = schedulerResources;

          // filter and display resources assigned to clicked event
          this.filterAndDisplayResources(filter);

          // modify/enrich scheduler resources server response
          const schedulerEvents: SchedulerEvent[] = [];
          schedulerResources.forEach(schResource => {

            // add custom properties (icons and alternative text)
            schResource.AssignedIcon = schResource.Assigned ? ResourceSchedulerSettings.icons.unassign : ResourceSchedulerSettings.icons.assign;
            schResource.AssignedAltText = schResource.Assigned ? ResourceSchedulerSettings.iconText.unassign : ResourceSchedulerSettings.iconText.assign;
            schResource.HasConflictIcon = schResource.HasConflict ? ResourceSchedulerSettings.icons.hasConflict : '';
            schResource.HasConflictAltText = schResource.HasConflict ? ResourceSchedulerSettings.iconText.hasConflict : '';

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
          this.resourceSchedulerObject = { dataSource: schedulerEvents, enableTooltip: false };
        }));
  }

  onNavigate(args: NavigatingEventArgs, schedulerType: string) {
    if (args.action === 'date') {
      if (schedulerType === 'evSch') {
        this.currEvSchInterval.currDate = args.currentDate;
        this.getSchedulerEvents(SchedulerTimeRange.get(this.currEvSchInterval.currView).getRange(this.currEvSchInterval.currDate));
      } else {
        this.currResSchInterval.currDate = args.currentDate;
        this.getSchedulerResourcesAndSchedulerEvents(
          { schedulerEvent: this.schedulerStatus.currentSchedulerEvent, filter: this.currentResourceFilter },
          SchedulerTimeRange.get(this.currResSchInterval.currView).getRange(this.currResSchInterval.currDate)
        );
      }
    }
    if (args.action === 'view') {
      if (schedulerType === 'evSch') {
        this.currEvSchInterval.currView = <View>args.currentView;
        this.getSchedulerEvents(SchedulerTimeRange.get(this.currEvSchInterval.currView).getRange(this.currEvSchInterval.currDate));
      } else {
        this.currResSchInterval.currView = <View>args.currentView;
        this.getSchedulerResourcesAndSchedulerEvents(
          { schedulerEvent: this.schedulerStatus.currentSchedulerEvent, filter: this.currentResourceFilter },
          SchedulerTimeRange.get(this.currResSchInterval.currView).getRange(this.currResSchInterval.currDate)
        );
      }
    }
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
          .subscribe(() => {
            this.getSchedulerResourcesAndSchedulerEvents(
              { schedulerEvent: this.schedulerStatus.currentSchedulerEvent, filter: this.currentResourceFilter },
              SchedulerTimeRange.get(this.currResSchInterval.currView).getRange(this.currResSchInterval.currDate));
            // refresh event scheduler
            this.getSchedulerEvents(SchedulerTimeRange.get(this.currEvSchInterval.currView).getRange(this.currEvSchInterval.currDate));
          })
      );
    } else if (!schedulerResource.Assigned) {
      this.subscriptions.push(
        this.schedulerService.assignResourceToSchedulerEvent(this.schedulerStatus.currentSchedulerEvent.RefId, schedulerResource.Id)
          .subscribe(() => {
            this.getSchedulerResourcesAndSchedulerEvents(
              { schedulerEvent: this.schedulerStatus.currentSchedulerEvent, filter: this.currentResourceFilter },
              SchedulerTimeRange.get(this.currResSchInterval.currView).getRange(this.currResSchInterval.currDate));
            // refresh event scheduler
            this.getSchedulerEvents(SchedulerTimeRange.get(this.currEvSchInterval.currView).getRange(this.currEvSchInterval.currDate));
          })
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
            this.getSchedulerResourcesAndSchedulerEvents(
              { schedulerEvent: this.schedulerStatus.currentSchedulerEvent, filter: this.currentResourceFilter },
              SchedulerTimeRange.get(this.currResSchInterval.currView).getRange(this.currResSchInterval.currDate)
            );
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

  getSchedulerHeights() {
    this.windowHeight = this.getAvailableHeight();
    // calculate space for the two schedulers.
    // subtract occupied space between the 2 schedulers (split gutter, margin and multiselect = 62px)
    this.eventSchedulerHeight = this.windowHeight * 1 / 3 - 30;
    this.resourceSchedulerHeight = this.windowHeight * 2 / 3 - 60;
    this.boxHeights = [this.windowHeight / 3, this.windowHeight * 2 / 3, 320];
  }

  private getAvailableHeight(heightTopBar: number = 60, heightRouteBar: number = 32, paddingTop: number = 15, paddingBottom: number = 15, heightFooter: number = 60): number {
    const usedSpace = heightTopBar + heightRouteBar + paddingTop + heightFooter + paddingBottom;
    const usableHeight = window.innerHeight - usedSpace;
    return (usableHeight);
  }

  // https://stackoverflow.com/questions/43590487/open-the-context-menu-by-primeng-from-code-angular-2?rq=1
  openContextMenu(schEvCM: ContextMenu, event: MouseEvent, data: SchedulerEvent): void {
    if (!((this.permissionsRecord[root.dto.Order.write]) || (this.permissionsRecord[root.dto.Order.delete]))) { return; }

    this.schedulerStatus.contextMenuOpen = true;
    const model: MenuItem[] = [];
    if (this.permissionsRecord[root.dto.Order.write]) {
      model.push(
        {
          label: ContextMenuSettings.iconText.edit,
          icon: ContextMenuSettings.icons.edit,
          command: () => { this.updateSchedulerEvent(data); },
        });
    }
    if (this.permissionsRecord[root.dto.Order.delete]) {
      model.push(
        {
          label: ContextMenuSettings.iconText.delete,
          icon: ContextMenuSettings.icons.delete,
          command: () => { this.deleteSchedulerEvent(data); },
        });
    }

    schEvCM.model = model;
    schEvCM.show(event);
  }

  closeContextMenu() {
    this.schedulerStatus.contextMenuOpen = false;
  }

  updateSchedulerEvent(data: SchedulerEvent) {
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: true,
        scenario: 'update',           // executeAction, create, update
        entityId: data.RefId,
        fields: this.configuration.fields,
        configType: 'Order'
      },
      header: data['Subject'] + ' bearbeiten',
      width: '500px'
    });

    dialogRef.onClose.subscribe((result: Observable<Object>) => {
      if (result !== undefined) {
        this.subscriptions.push(
          result.subscribe(() => {
            this.getSchedulerEvents(SchedulerTimeRange.get(this.currEvSchInterval.currView).getRange(this.currEvSchInterval.currDate));
            if (this.showResourceScheduler) {
              this.getSchedulerResourcesAndSchedulerEvents(
                { schedulerEvent: this.schedulerStatus.currentSchedulerEvent, filter: this.currentResourceFilter },
                SchedulerTimeRange.get(this.currResSchInterval.currView).getRange(this.currResSchInterval.currDate)
              );
            }
          })
        );
      }
    });
  }

  addSchedulerEvent(data: any) {
    if (this.schedulerStatus.contextMenuOpen) { return; }
    if (!this.permissionsRecord[root.dto.Order.create]) { return; }

    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: false,
        scenario: 'create',           // executeAction, create, update
        entity: { startDate: data.startTime, endDate: data.endTime },
        fields: this.configuration.fields,
        configType: 'Order'
      },
      header: 'Eintrag erstellen',
      width: '500px'
    });

    dialogRef.onClose.subscribe((result: Observable<Object>) => {
      if (result !== undefined) {
        this.subscriptions.push(
          result.subscribe(() => this.getSchedulerEvents(SchedulerTimeRange.get(this.currEvSchInterval.currView).getRange(this.currEvSchInterval.currDate)))
        );
      }
    });
  }

  deleteSchedulerEvent(data: SchedulerEvent) {
    this.confirmationService.confirm({
      message: 'Sind Sie sicher, dass Sie diesen Eintrag löschen wollen?',
      accept: () => {
        this.subscriptions.push(
          this.entityService.deleteEntity('Order', data['RefId']).subscribe(() => {
            this.getSchedulerEvents(SchedulerTimeRange.get(this.currEvSchInterval.currView).getRange(this.currEvSchInterval.currDate));
            if (this.showResourceScheduler) {
              if (this.schedulerStatus.currentSchedulerEvent.Id !== data.Id) {
                this.getSchedulerResourcesAndSchedulerEvents(
                  { schedulerEvent: this.schedulerStatus.currentSchedulerEvent, filter: this.currentResourceFilter },
                  SchedulerTimeRange.get(this.currResSchInterval.currView).getRange(this.currResSchInterval.currDate)
                );
              } else {
                this.showResourceScheduler = false;
              }
            }
          })
        );
      }
    });
  }

  validate(event: ResizeEvent): boolean {
    const resizeBounds = [{ min: 15, max: 1000 }, { min: 15, max: 1000 }, { min: 15, max: 320 }];
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.height < resizeBounds[this['elm']['nativeElement']['id']].min ||
        event.rectangle.height > resizeBounds[this['elm']['nativeElement']['id']].max)
    ) {
      return false;
    }
    return true;
  }

  // Resizes the divs and schedulers during dragging action
  // Has quite a big performance impact, not sure why..
  // Can be substituted by built-in "ghostResize" which doesn't affect the position of other site elements though
  onResizing(event: ResizeEvent, id: number): void {
    // Only resize if last resize has happended more than 20ms ago
    if (Date.now() - this.lastResize > 20) {
      this.boxHeights[id] = event.rectangle.height;
      this.lastResize = Date.now();

      // resizes resource and event schedulers aswell. Currently runs fine on my end but might cause peformance problems
      if (id === 0) {
        this.eventSchedulerHeight = event.rectangle.height - 30;
      } else if (id === 1) {
        this.resourceSchedulerHeight = event.rectangle.height - 60;
      }
    }
  }

  onResizeEnd(event: ResizeEvent, id: number): void {
    this.boxHeights[id] = event.rectangle.height;
    if (id === 0) {
      this.eventSchedulerHeight = event.rectangle.height - 30;
    } else if (id === 1) {
      this.resourceSchedulerHeight = event.rectangle.height - 60;
    }
  }

  // hide syncfusion scheduler native popups
  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor' || args.type === 'QuickInfo') {
      args.cancel = true;
    }
  }

}
