import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { EntityConfiguration } from '../../models/entity-configuration';
import { Field } from '../../models/field';
import { EntityData } from '../../models/entity-data';
import { EntityService } from '../../services/entity.service';
import { LazyLoadEvent, DialogService, ConfirmationService } from 'primeng/primeng';
import { TableData } from '../../models/table-data';
import { EntityDialogComponent } from '../entity-dialog/entity-dialog.component';
import { Observable, Subject, Subscription } from 'rxjs';
import { ErrorNotificationService } from '../../services/error-notification.service';
import { delay } from 'q';
import { UrlCollection } from '../../url-collection';
import * as fromConfigSelectors from '../../../root-store/config-store/selectors';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { RootStoreState } from 'src/app/root-store/root-index';
import { CatalogueService } from 'src/app/user/services/catalogue.service';
import { root } from 'src/app/jmeleon/modules/permissions/permissions';
import { JmeleonActionsPermissionService } from 'src/app/jmeleon/modules/permissions/services/jmeleon-actions-permission.service';
import { SettingsService } from 'src/app/jmeleon/modules/settings/services/settings.service';
import { ScriptActionDefinition, ScriptActionPayload } from '../../models/script-action';
import { ScriptResultComponent } from 'src/app/jmeleon/components/script-result/script-result.component';
import { FileUploadDialogComponent } from '../file-upload-dialog/file-upload-dialog.component';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
  providers: [ConfirmationService]
})
export class DynamicTableComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() tableData: TableData;
  @Input() mainId: number;
  @Input() mainType: string;
  @Input() dblClickCallback: (data) => any;
  @Output() entitySelection = new EventEmitter();

  configuration: EntityConfiguration;
  subscriptions: Subscription[] = [];
  fields: Field[];
  loading = true; // Needs to be true to prevent ExpressionHasChangedError
  entityData: EntityData;
  selectedEntry: any;
  selectedEntryId: number;
  $entryId: Subject<number> = new Subject();
  lastLazyLoadEvent: LazyLoadEvent;
  filtersInTable = false;
  showButtons = false;
  root = root;
  minTableWidth: number;
  freeColumnSpace = 100;
  zeroWidthColumns = 0;
  currency$: Observable<string>;
  actionCount: number;
  displayEntitySelectionDialog = false;
  entitySelectionTableData: TableData;
  entitySelectionContext: { field: string, id: number };
  cellEditCache: any;
  lastCellRef: any;
  crudColumnSpace: number;
  saved = false;

  constructor(
    private entityService: EntityService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private catalogueService: CatalogueService,
    private errorNotificationService: ErrorNotificationService,
    private store$: Store<RootStoreState.State>,
    private japs: JmeleonActionsPermissionService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    const configuration$: Observable<EntityConfiguration> = this.store$.pipe(
      select(fromConfigSelectors.selectConfigs),
      map(configs => configs[this.tableData.entityType])
    );

    this.cellEditCache = new Map();
    this.configuration = new EntityConfiguration();
    this.entityData = new EntityData();
    this.subscriptions.push(configuration$.subscribe(async config => {
      // Get the config according to the given name
      this.configuration = config;
      if (this.configuration === undefined) {
        console.log('[Dynamic-Table] config with name ' + this.tableData.entityType + ' not found!');
        return;
      }

      // get Currency from settings
      this.currency$ = this.settingsService.getSetting('CURRENCY').pipe(map(setting => setting.value));

      this.checkShowButtons();

      this.minTableWidth = this.showButtons ? 90 : 0;
      this.fields = this.configuration.fields.filter(field => field.visible === true);
      this.fields.forEach(field => {
        if (!field.width) {
          this.zeroWidthColumns++;
        } else {
          this.minTableWidth += !field.width.endsWith('%') ? Number.parseInt(field.width, 10) : 0;
          this.freeColumnSpace -= field.width.endsWith('%') ? Number.parseInt(field.width, 10) : 0;
        }

        this.filtersInTable = field.filterType !== 'none' || this.filtersInTable;
        if (!Field.isPrimitiveType(field.type)) {
          field.options = [];

          if ((field.type === 'CatalogueEntry' || field.type === 'Icon') && field.defaultCatalogue) {
            this.subscriptions.push(
              this.catalogueService.getCatalogue(field.defaultCatalogue)
                .subscribe(catalogue => {
                  catalogue.values.forEach(o => {
                    if (field.type === 'CatalogueEntry') {
                      field.options.push({ label: o.name, value: o.id });
                    } else {
                      this.entityService.getAttachments('attribute', 'CatalogueEntry', o.id).subscribe((attributes: any) => {
                        const icon = attributes.find(attr => attr['name'] === 'icon');
                        const color = attributes.find(attr => attr['name'] === 'color');
                        field.options.push({
                          label: '__icon__', value:
                            { id: '' + o.id, icon: icon ? icon['stringValue'] : '', color: color ? color['stringValue'] : '' }
                        });
                      });
                    }
                  });
                }));
          } else {
            // when multiselecting an DTOType we need to fill the combo with all entity ids and reprs
            this.subscriptions.push(
              this.entityService.filter(field.type, 1, 100000, undefined, undefined, undefined)
                .subscribe(data => {
                  data.data.forEach(o => field.options.push({ label: o._repr_, value: o.id }));
                }));
          }
        }
      });

      this.subscriptions.push(this.tableData.triggerRefresh.subscribe(() => this.refreshTableContents()));
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.mainId && !changes.mainId.firstChange) {
      this.refreshTableContents();
    }
  }

  ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));
  }

  async rowSelect() {
    this.entitySelection.emit(this.selectedEntry);
    this.selectedEntryId = this.selectedEntry['id'];
  }

  async rowUnselect() {
    this.entitySelection.emit(undefined);
    this.selectedEntryId = undefined;
  }

  async refreshTableContents() {
    this.loadLazy(this.lastLazyLoadEvent);
  }

  async loadLazy(event: LazyLoadEvent) {
    // Check if the configuration data requested in ngOnInit has already been received
    let timeout = 5000;
    while ((!this.configuration || !this.fields) && timeout !== 0) {
      await delay(null, 50).then();
      timeout -= 50;
    }

    if (timeout === 0) {
      this.errorNotificationService.addErrorNotification('Connection timeout', 'Unable to receive configuration data from the server');
      return;
    }

    this.lastLazyLoadEvent = event;
    this.loading = true;

    let sorting = '';
    let qualifier = '';

    this.fields.forEach(field => {
      if (event.filters[field.field]) {

        const value: any = event.filters[field.field].value;

        if (field.filterType === 'text') {
          const filterContent: string = value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
          if (field.type === 'String') {
            qualifier += 'LIKE(\'' + field.field + '\',\'%' + filterContent + '%\'),';
          } else {
            qualifier += 'EQ(\'' + field.field + '\',' + filterContent + '),';
          }
        } else if (field.filterType === 'multiSelect') {
          if (field.type === 'Icon') {
            const f = field.field.slice(0, -4) + 'Id';
            qualifier += 'IN(\'' + f + '\'';
            value.forEach(v => qualifier += ',' + v.id);
            qualifier += '),';
          } else {
            qualifier += 'IN(\'' + field.field + '\',' + value.toString() + '),';
          }
        } else if (field.filterType === 'integer') {
          qualifier += 'EQ(\'' + field.field + '\',' + value.toString() + '),';
        }
      }
    });

    const sort = this.fields.find(field => { if (field.field === event.sortField) { return true; } });

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
      this.subscriptions.push(
        this.entityService.filter(this.tableData.entityType, page, event.rows, this.mainId, qualifier, sorting).pipe(
          map(entities => {
            this.configuration.fields.filter(field => field.type === 'Date').forEach(field => {
              entities.data.forEach(data => data[field.field] = new Date(data[field.field]));
            });
            return entities;
          }))
          .subscribe(data => {
            this.entityData = data; this.loading = false;
            this.crudColumnSpace = this.calcCrudColWidth(this.entityData.maxActionNumber);
            }));
    } else {
      this.subscriptions.push(
        this.tableData.dataSource
          .subscribe(data => {
            this.entityData = data; this.loading = false;
            this.crudColumnSpace = this.calcCrudColWidth(this.entityData.maxActionNumber);
          }));
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
      case 'python':
        return input ? '<python>' : undefined;
      case 'json':
        return input ? '<json>' : undefined;
      case 'String':
      case 'int':
      case 'Icon':
      case 'Currency':
      case 'dtoType':
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
        scenario: 'create',           // executeAction, create, update
        fields: this.configuration.fields,
        configType: this.configuration.type,
        mainId: this.mainId
      },
      header: 'Hinzufügen',
      width: '500px'
    });

    this.subscriptions.push(
      dialogRef.onClose.subscribe((result: Observable<Object>) => {
        if (result !== undefined) {
          result.subscribe(() => this.loadLazy(this.lastLazyLoadEvent));
        }
      })
    );
  }

  updateEntity(data: any) {
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: true,
        scenario: 'update',           // executeAction, create, update
        entity: data,
        fields: this.configuration.fields,
        configType: this.configuration.type,
        mainId: this.mainId
      },
      header: data['_repr_'] + ' bearbeiten',
      width: '500px'
    });

    this.subscriptions.push(
      dialogRef.onClose.subscribe((result: Observable<Object>) => {
        if (result !== undefined) {
          result.subscribe(() => this.loadLazy(this.lastLazyLoadEvent));
        }
      })
    );
  }

  // covers multiple scenarios:
  // 1a) File entity: create new file:                ownerId: undefined   ownerType: undefined   fileId: undefined
  // 1b) File entity: update existing file:           ownerId: undefined   ownerType: undefined   fileId: set
  // 2a) FileAttachment entity: create new file:      ownerId: set         ownerType: set         fileId: undefined
  // 2b) FileAttachment entity: update existing file: ownerId: set         ownerType: set         fileId: set
  // FileUploadDialogComponent decides depending on these parameters what to do (attach yes/no, update/create)
  uploadFile(ownerId?: number, ownerType?: string, fileId?: number) {

    const dialogRef = this.dialogService.open(FileUploadDialogComponent, {
      data: {
        catalogueName: 'FileTypes',
        catalogueDisplayName: 'Dateityp',
        ownerId: ownerId,
        ownerType: ownerType,
        fileId: fileId
      },
      header: 'Datei aktualisieren',
      width: '800px'
    });

    this.subscriptions.push(
      dialogRef.onClose.subscribe(() => this.loadLazy(this.lastLazyLoadEvent))
    );
  }

  deleteEntity(data: any) {
    this.confirmationService.confirm({
      message: 'Sind Sie sicher, dass Sie diesen Eintrag löschen wollen?',
      accept: () => {
        this.subscriptions.push(this.entityService.deleteEntity(this.configuration.type, data['id']).subscribe(() => this.loadLazy(this.lastLazyLoadEvent)));
      }
    });
  }

  doubleClickTableRow(data: any) {
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

  checkShowButtons() {
    if (!this.tableData.showButtons) { return; }

    if (this.configuration.type !== 'FileAttachment') {
      this.subscriptions.push(
        this.japs.userHasPermissionForActions([root.dto.$dtoType.delete, root.dto.$dtoType.write], { '$dtoType': this.configuration.type }).subscribe(record => {
          this.showButtons = !Object.entries(record).every(entry => !entry[1]);
        })
      );
    } else {
      this.subscriptions.push(
        this.japs.userHasPermissionForActions([root.dto.FileAttachment.download]).subscribe(record => {
          this.showButtons = !Object.entries(record).every(entry => !entry[1]);
        })
      );
    }
  }

  onTableResize(event) {
    // Without the event the column width wouldn't be recalculated after a resize
  }

  calcWidth(col: Field, width: number) {
    if (this.configuration.minWidth && this.configuration.scrollable) {
      width = Math.max(width, this.configuration.minWidth);
    }

    width -= this.minTableWidth + (this.showButtons ? (this.crudColumnSpace) : 2);
    if (!col.width) {
      return Math.floor(this.freeColumnSpace / this.zeroWidthColumns * width / 100.0) + 'px';
    } else if (col.width.endsWith('px')) {
      return col.width;
    } else {
      return Math.floor(Number.parseInt(col.width, 10) * width / 100.0) + 'px';
    }
  }

  calcCrudColWidth(actionCount: number): number	{
    // width required to display action icons, per Icon 32px required, additional offset of 2x13px for margin
    return (actionCount * 32) + 26;
  }

  executeAction(actionHrid: string, dtoType: string, entityId: number) {
    const payload: ScriptActionPayload = { actionHrid: actionHrid, entityReference: { dtoType: dtoType, id: entityId } };

    // run getAction API to retrieve information (HRID and params) required to execute the action
    this.subscriptions.push(
      this.entityService.getAction(payload).subscribe((actionDetails: ScriptActionDefinition) => {
        payload['actionHrid'] = actionDetails.actionHrid; // prepare payload for executeAction (add HRID)

        if (actionDetails.params.length > 0) {  // if there are params to be specified open entity dialog
          let entityObj: Object;
          entityObj = <Object>(actionDetails);

          const dialogRef = this.dialogService.open(EntityDialogComponent, {
            data: {
              update: true,
              scenario: 'executeAction',           // executeAction, create, update
              entity: entityObj,
              fields: actionDetails.params,
              configType: this.configuration.type,
              mainId: this.mainId,
              payload: payload
            },
            header: 'Aktionsparameter',
            width: '500px'
          });

          dialogRef.onClose.subscribe((response: Observable<Object>) => {
            if (response !== undefined) {
              response.subscribe((result) => {
                this.loadLazy(this.lastLazyLoadEvent);
                this.showActionResult(actionDetails.name, result['result'], result['output'], actionDetails.showResult);
              });
            }
          });

          // if there are no params do not make any turnarounds and just go!
        } else {
          this.entityService.executeAction(payload, false).subscribe(result => {
            this.loadLazy(this.lastLazyLoadEvent);
            this.showActionResult(actionDetails.name, result['result'], result['output'], actionDetails.showResult);
          });
        }
      })
    );
  }

  showActionResult(actionName: string, result: string, output: string, showResult: boolean) {
    if (!showResult) {
      this.errorNotificationService.addSuccessNotification('Aktion ' + actionName + ' executed sucessfully', result);
    } else {
      const dialogRef = this.dialogService.open(ScriptResultComponent, {
        data: {
          result: result,
          output: output
        },
        header: actionName + ' ausgeführt',
        width: '800px'
      });
    }

  }

  entitySelected(entity: any) {
    const rowData = this.entityData.data.find(row => row['id'] === this.entitySelectionContext.id);
    rowData[this.entitySelectionContext.field] = { id: entity['id'], _repr_: entity['_repr_'] };
    this.displayEntitySelectionDialog = false;
    this.completeCellEdit(rowData);
  }

  openEntitySelectionDialog(field: any, id: number) {
    this.entitySelectionContext = { field: field['field'], id: id };
    this.entitySelectionTableData = new TableData(field['type'], field['type'])
      .hideHeader()
      .hideHeadline()
      .hideAttachments()
      .hideButtons()
      .setScrollable()
      .disableInlineEdit()
      .setScrollHeight('700px');
    this.displayEntitySelectionDialog = true;
  }

  abortCellEdit(rowData, event) {
    if (event.relatedTarget === undefined || event.relatedTarget === null || event.relatedTarget['id'] !== this.cellEditCache.field + '§' + rowData['id']) {
      if (this.cellEditCache !== undefined) {
        rowData[this.cellEditCache.field] = this.cellEditCache.data[this.cellEditCache.field];
        this.cellEditCache = undefined;
      }
      if (this.lastCellRef !== undefined) {
        this.lastCellRef.isEdited = false;
        this.lastCellRef = undefined;
      }
    } else {
      this.completeCellEdit(rowData);
    }
  }

  initCellEdit(cellRef, field: string, rowData) {
      // If another cell is being edited abort the edit operation and initialize the new edit operation
    if (this.lastCellRef !== undefined && this.cellEditCache !== undefined) {
      const rowDataPrev = this.entityData.data.find(row => row['id'] === this.cellEditCache.data['id']);
      rowDataPrev[this.cellEditCache.field] = this.cellEditCache.data[this.cellEditCache.field];
      this.lastCellRef.isEdited = false;
    }
    this.cellEditCache = {field: field, data: Object.assign({}, rowData)};
    cellRef.isEdited = true;
    this.lastCellRef = cellRef;
  }

  completeCellEdit(data) {
    this.lastCellRef = undefined;
    this.cellEditCache = undefined;

    const dateFields = this.configuration.fields.filter(field => field.type === 'Date');
    dateFields.forEach(field => {
      data[field.field] = new Date(data[field.field]).toISOString();
    });

    this.entityService.updateEntity(this.tableData.entityType, data['id'], data).subscribe(result => {
      const index = this.entityData.data.findIndex(data_ => data_['id'] === result['fields']['id']);
      dateFields.forEach(field => {
        result['fields'][field.field] = new Date(result['fields'][field.field]);
      });
      this.entityData.data[index] = result['fields'];
    }, error => this.refreshTableContents());
  }

}
