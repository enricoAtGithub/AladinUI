import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter} from '@angular/core';
import { EntityConfiguration } from '../../models/entity-configuration';
import { Field } from '../../models/field';
import { EntityData } from '../../models/entity-data';
import { EntityService } from '../../services/entity.service';
import { LazyLoadEvent, DialogService, ConfirmationService } from 'primeng/primeng';
import { TableData } from '../../models/table-data';
import { EntityDialogComponent } from '../entity-dialog/entity-dialog.component';
import { Observable, Subject } from 'rxjs';
import { ErrorNotificationService } from '../../services/error-notification.service';
import { ErrorMessage } from '../../models/error-message';
import { delay } from 'q';
import { UrlCollection } from '../../url-collection';
import * as fromConfigSelectors from '../../../root-store/config-store/selectors';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { RootStoreState } from 'src/app/root-store/root-index';
import { CatalogueService } from 'src/app/user/services/catalogue.service';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
  providers: [ConfirmationService]
})
export class DynamicTableComponent implements OnInit {
  @Input() tableData: TableData;
  @Input() mainId: number;
  @Input() dblClickCallback: (data) => any;
  @Output() onEntitySelection = new EventEmitter();

  configuration: EntityConfiguration;
  fields: Field[];
  loading = true; // Needs to be true to prevent ExpressionHasChangedError
  entityData: EntityData;
  selectedEntry: any;
  selectedEntryId: number;
  $entryId: Subject<number> = new Subject();
  lastLazyLoadEvent: LazyLoadEvent;
  filtersInTable = false;

  constructor(private entityService: EntityService, private cd: ChangeDetectorRef,
    private dialogService: DialogService, private confirmationService: ConfirmationService, private catalogueService: CatalogueService,
    private errorNotificationService: ErrorNotificationService, private store$: Store<RootStoreState.State>) {}

  ngOnInit() {
    const configuration$: Observable<EntityConfiguration> = this.store$.pipe(
      select(fromConfigSelectors.selectConfigs),
      map(configs => configs[this.tableData.entityType])
    );

    this.configuration = new EntityConfiguration();
    this.entityData = new EntityData();
    configuration$.subscribe(async config => {
      // Get the config according to the given name
      this.configuration = config;
      if (this.configuration === undefined) {
        console.log('[Dynamic-Table] config with name ' + this.tableData.entityType + ' not found!');
        return;
      }

      this.fields = this.configuration.fields.filter(field => field.visible === true);
      this.fields.forEach(field => {
        this.filtersInTable = field.filterType !== 'none' || this.filtersInTable
        if (field.filterType === 'multiSelect' && !Field.isPrimitiveType(field.type)) {
          field.options = [];

          if (field.type === 'CatalogueEntry' && field.defaultCatalogue) {
            this.catalogueService.getCatalogue(field.defaultCatalogue)
            .subscribe(catalogue => {
              catalogue.values.forEach(o => field.options.push({label: o.name, value: ''+o.id}));
            });
          } else {
            // when multiselecting an DTOType we need to fill the combo with all entity ids and reprs
            this.entityService.filter(field.type, 1, 100000, undefined, undefined, undefined)
              .subscribe(data => {
                data.data.forEach(o => field.options.push({label: o._repr_, value: o.id}));
              });
            }
        }
      });

      this.tableData.triggerRefresh.subscribe( () => this.refreshTableContents());
    });
  }

  async rowSelect() {
    this.onEntitySelection.emit(this.selectedEntry);
    this.selectedEntryId = this.selectedEntry['id'];
  }

  async rowUnselect() {
    this.onEntitySelection.emit(undefined);
    this.selectedEntryId = undefined;
  }

  async refreshTableContents() {
    this.loadLazy(this.lastLazyLoadEvent);
  }

  async loadLazy(event: LazyLoadEvent) {
    // Check if the configuration data requested in ngOnInit has already been reveived
    let timeout = 5000;
    while ((!this.configuration || !this.fields) && timeout !== 0) {
      await delay(null, 50).then();
      timeout -= 50;
    }

    if (timeout === 0) {
      this.errorNotificationService.addErrorNotification(
        new ErrorMessage('error', 'Connection timeout', 'Unable to receive configuration data from the server'));
      return;
    }

    this.lastLazyLoadEvent = event;
    this.loading = true;

    let sorting = '';
    let qualifier = '';

    this.fields.forEach(field => {
      if (event.filters[field.field]) {

        if (field.filterType === 'text') {
          const filterContent: string = event.filters[field.field].value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
          if (field.type === 'String') {
            qualifier += 'LIKE(\'' + field.field + '\',\'%' + filterContent  + '%\'),';
          } else {
            qualifier += 'EQ(\'' + field.field + '\',' + filterContent + '),';
          }
        } 
        else if (field.filterType === 'multiSelect') {
          qualifier += 'IN(\'' + field.field + '\',' + event.filters[field.field].value.toString() + '),'
        }
      }
    });

    const sort = this.fields.find(field => {if (field.field === event.sortField) {return true; }});

    if (sort) {
      if (event.sortOrder === 1) {
        sorting += 'ASC(\'' + sort.field + '\')';
      } else {
        sorting += 'DESC(\'' + sort.field + '\')';
      }
    }

    let page = 1;
    if (event.rows) {
      page = event.first / <number>event.rows + 1;
    }

    if (this.tableData.dataSource === undefined) {
      this.entityService.filter(this.tableData.entityType, page, event.rows, this.mainId, qualifier, sorting)
        .subscribe(data => { this.entityData = data; this.loading = false; });
    } else {
      this.tableData.dataSource.subscribe(data => { this.entityData = data; this.loading = false; });
    }
  }

  processData(input: any, field: Field): string {
    if (input == null) {
      return '';
    }

    switch (field.type) {
      case 'Date':
        return this.processDate(new Date(input));
      case 'boolean':
        return input ? '✓' : '🞩';
      case 'String':
      case 'int':
      case 'Icon':
        return input;
      default:
        return input['_repr_'];
    }
  }

  // returns number as string with leading zero
  lZ(num: Number): string {
    return ('0' + num).slice(-2);
  }

  processDate(date: Date): string {
    return this.lZ(date.getDate()) + '.' + this.lZ(date.getMonth() + 1) + '.' + date.getFullYear() + ' ' +
      this.lZ(date.getHours()) + ':' + this.lZ(date.getMinutes());
  }

  showAddEntityDialog() {
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: false,
        config: this.configuration
      },
      header: 'Hinzufügen',
      width: '500px'
    });

    dialogRef.onClose.subscribe((result: Observable<Object>) => {
      if (result !== undefined) {
        result.subscribe(() => this.loadLazy(this.lastLazyLoadEvent));
      }
    });
  }

  updateEntity(data: any) {
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: true,
        entity: data,
        config: this.configuration
      },
      header: data['_repr_'] + ' bearbeiten',
      width: '500px'
    });

    dialogRef.onClose.subscribe((result: Observable<Object>) => {
      if (result !== undefined) {
        result.subscribe(() => this.loadLazy(this.lastLazyLoadEvent));
      }
    });
  }

  deleteEntity(data: any) {
    this.confirmationService.confirm({
      message: 'Sind Sie sicher, dass Sie diesen Eintrag löschen wollen?',
      accept: () => {
        this.entityService.deleteEntity(this.configuration.type, data['id']).subscribe(() => this.loadLazy(this.lastLazyLoadEvent));
      }
    });
  }

  doubleClickTableRow(data: any ) {
    if (typeof this.dblClickCallback === 'undefined') {
      console.log('no handler defined for DblClick events');
    } else {
      this.dblClickCallback(data);
    }
  }

  public getEntityData(): EntityData {
    return this.entityData;
  }

  downloadUrl(id: number): string {
    return UrlCollection.Files.generateDownloadUrl(id);
  }
}
