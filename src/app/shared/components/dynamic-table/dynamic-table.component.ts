import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { EntityConfiguration } from '../../models/entity-configuration';
import { Field } from '../../models/field';
import { EntityData } from '../../models/entity-data';
import { EntityService } from '../../services/entity.service';
import { LazyLoadEvent, DialogService, ConfirmationService } from 'primeng/primeng';
import { TableData } from '../../models/table-data';
import { EntityDialogComponent } from '../entity-dialog/entity-dialog.component';
import { Observable, Subject, Subscription, EMPTY } from 'rxjs';
import { ErrorNotificationService } from '../../services/error-notification.service';
import { delay } from 'q';
import { UrlCollection } from '../../url-collection';
import * as fromConfigSelectors from '../../../root-store/config-store/config.selectors';
import { Store, select } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { RootStoreState } from 'src/app/root-store/root-index';
import { CatalogueService } from 'src/app/user/services/catalogue.service';
import { root } from 'src/app/jmeleon/modules/permissions/permissions';
import { JmeleonActionsPermissionService } from 'src/app/jmeleon/modules/permissions/services/jmeleon-actions-permission.service';
import { SettingsService } from 'src/app/jmeleon/modules/settings/services/settings.service';
import { ScriptActionDefinition, ScriptActionPayload } from '../../models/script-action';
import { ScriptResultComponent } from 'src/app/jmeleon/components/script-result/script-result.component';
import { FileUploadDialogComponent } from '../file-upload-dialog/file-upload-dialog.component';
import { JmlNavigationService } from 'src/app/jmeleon/services/jml-navigation.service';
import { Router } from '@angular/router';
import { CodeEditorComponent } from '../code-editor/code-editor.component';

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
  @Input() selectedId: string;
  @Input() attachmentCategory: string; // FileAttachment category
  @Input() token: string;
  @Output() entitySelection = new EventEmitter();
  @Output() entityOperation = new EventEmitter();

  @ViewChild('dt', {read: ElementRef, static: false}) dynamicTableRef: ElementRef;

  configuration: EntityConfiguration;
  subscriptions: Subscription[] = [];
  fields: Field[] = [];
  editableFields: Field[] = [];
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
  currency: string;
  actionCount: number;
  displayEntitySelectionDialog = false;
  entitySelectionTableData: TableData;
  entitySelectionContext: { field: string, id: number };
  cellEditCache: any;
  lastCellRef: any;
  crudColumnSpace: number;
  refreshTrigger: Subject<any>;
  rowsPerPageOptions = [10, 25, 50];

  constructor(
    private entityService: EntityService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private catalogueService: CatalogueService,
    private errorNotificationService: ErrorNotificationService,
    private store$: Store<RootStoreState.State>,
    private japs: JmeleonActionsPermissionService,
    private settingsService: SettingsService,
    private jmlNavigationService: JmlNavigationService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get observable for entity configuration from store
    const configuration$: Observable<EntityConfiguration> = this.store$.pipe(
      select(fromConfigSelectors.selectConfigs),
      map(configs => configs[this.tableData.entityType])
    );

    this.cellEditCache = new Map();
    this.configuration = new EntityConfiguration();
    this.entityData = new EntityData();

    this.refreshTrigger = new Subject();
    this.subscriptions.push(this.refreshTrigger.asObservable().subscribe(() => this.refreshTableContents()));

    this.settingsService.getSetting('CURRENCY').pipe(map(setting => setting.value)).subscribe(currency => this.currency = currency);

    this.subscriptions.push(configuration$.subscribe(async config => {
      // Get the config according to the given name
      this.configuration = config;
      if (this.configuration === undefined) {
        console.log('[Dynamic-Table] config with name ' + this.tableData.entityType + ' not found!');
        return;
      }

      // Add rows per page option to dropdown if defined in config
      if (!this.rowsPerPageOptions.includes(this.configuration.rowsPerPage)) {
        this.rowsPerPageOptions.push(this.configuration.rowsPerPage);
        this.rowsPerPageOptions.sort();
      }

      this.checkShowButtons();

      this.minTableWidth = 0;
      const calcMinWidth = this.configuration.minWidth === -1;

      this.configuration.fields.forEach(field => {

        // collect all editable fields (user has edit permission and field is editable === true)
        if (field.editable) {
          const requestedPermissions = [root.dto.$dtoType.write, root.dto.$dtoType.$dtoField.write];
          this.subscriptions.push(
            this.japs.userHasPermissionForActions(requestedPermissions, { '$dtoType': this.configuration.type, '$dtoField': field.field }).subscribe(permissions => {
              if (permissions[root.dto.$dtoType.write] && permissions[root.dto.$dtoType.$dtoField.write]) {
                this.editableFields.push(field);
              }
            })
          );
        }

        // only consider allowed fields (user has reading permissions) which are visible === true
        this.subscriptions.push(
          this.japs.userHasPermissionForAction(root.dto.$dtoType.$dtoField.read, { '$dtoType': this.configuration.type, '$dtoField': field.field }).subscribe(userHasReadPermission => {
            if (userHasReadPermission && field.visible) {
              this.fields.push(field);

              // Calculate minWidth if set to auto (-1)
              if (calcMinWidth) {
                switch (field.type) {
                  case 'int':
                    this.configuration.minWidth += 100;
                    break;
                  case 'String':
                    this.configuration.minWidth += 200;
                    break;
                  case 'boolean':
                    this.configuration.minWidth += 50;
                    break;
                  case 'Date':
                    this.configuration.minWidth += 150;
                    break;
                  default:
                    this.configuration.minWidth += 150;
                }
              }

              if (!field.width) {
                this.zeroWidthColumns++;
              } else {
                this.minTableWidth += !field.width.endsWith('%') ? Number.parseInt(field.width, 10) : 0;
                this.freeColumnSpace -= field.width.endsWith('%') ? Number.parseInt(field.width, 10) : 0;
              }

              this.filtersInTable = field.filterType !== 'none' || this.filtersInTable;
              field.options = [];

              // get catalogue information for every field of type CatalogueEntry
              if ((Field.isCatalogueEntry(field) || Field.isIcon(field)) && field.defaultCatalogue) {
                this.subscriptions.push(
                  this.catalogueService.getCatalogue(field.defaultCatalogue)
                    .subscribe(catalogue => {
                      catalogue.values.forEach(o => {
                        if (Field.isCatalogueEntry(field)) {
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
              } else if (Field.isDtoType(field)) {
                // get all dtoConfigs for field.type === 'dtoType' (e.g. for Script Actions)
                const configurations$ = this.store$.pipe(select(fromConfigSelectors.selectConfigs));
                this.subscriptions.push(
                  configurations$.subscribe(configs => Object.values(configs).map(o => field.options.push({ label: o.type, value: o.type })))
                );
              }
            }
          })
        );
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

    if (!!this.selectedId) {
      qualifier += `EQ('id',${this.selectedId}),`;
    }

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
              entities.data.forEach(data => {
                if (data[field.field] !== null) {
                  data[field.field] = new Date(data[field.field]);
                }
              });
            });
            return entities;
          }))
          .subscribe(data => {
            this.entityData = data; this.loading = false;
            this.crudColumnSpace = this.calcCrudColWidth(this.entityData.maxActionNumber);
            if (this.selectedId) {
              this.selectedEntryId = +this.selectedId;
              this.selectedEntry = data.data.find(entity => entity['id'] === +this.selectedId);
            }
          }));
    } else {
      this.subscriptions.push(
        this.tableData.dataSource
          .subscribe(data => {
            this.entityData = data; this.loading = false;
            this.crudColumnSpace = this.calcCrudColWidth(this.entityData.maxActionNumber);
            if (this.selectedId) {
              this.selectedEntryId = +this.selectedId;
              this.selectedEntry = data.data.find(entity => entity['id'] === +this.selectedId);
            }
          }));
    }
  }

  processData(input: any, field: Field): string {
    if (input == null) {
      return '';
    }

    switch (field.type) {
      case 'Date':
        return input ? this.processDate(new Date(input)) : '';
      case 'boolean':
        return input ? '✓' : '🞩';
      case 'python':
        return input ? '<python>' : undefined;
      case 'json':
        return input ? '<json>' : undefined;
      case 'float':
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

  createEntity() {

    if ((!this.configuration.customCreation) || this.configuration.customCreation.creationMode === 'createEntity') {
      const dialogRef = this.dialogService.open(EntityDialogComponent, {
        data: {
          update: false,
          fields: this.editableFields,
          configType: this.configuration.type,
          mainId: this.mainId
        },
        header: 'Hinzufügen',
        width: '500px'
      });

      // following code is refactored according https://medium.com/@paynoattn/3-common-mistakes-i-see-people-use-in-rx-and-the-observable-pattern-ba55fee3d031
      // this.subscriptions.push(
      //   dialogRef.onClose.subscribe((fields: Field[]) => {
      //     if (fields) {  // in case the dynamicDialog is closed via "x" at top right corner, nothing is returned
      //       this.entityService.createEntity(this.configuration.type, fields)
      //         .subscribe(() => {
      //           this.loadLazy(this.lastLazyLoadEvent);
      //           this.entityOperation.emit(null);
      //         });
      //     }
      //   })
      // );

      this.subscriptions.push(
        dialogRef.onClose.pipe(
          switchMap((fields: Field[]) => {
            if (fields) {
              this.loading = true;
              return this.entityService.createEntity(this.configuration.type, fields);
            } else {
              return EMPTY;
            }
          })).subscribe(
            () => {
              this.loadLazy(this.lastLazyLoadEvent);
              this.entityOperation.emit(null);
            },
            error => console.error('[Dynamic-Table] Method createEntity failed!\n' + error)
          )
      );

    } else if (this.configuration.customCreation.creationMode === 'executeAction') {
      this.executeAction(this.configuration.customCreation.creationAction.action, this.mainType, this.mainId, true);

    }

  }

  updateEntity(rowData: Field[]) {
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: true,
        entity: rowData,
        fields: this.editableFields,
        configType: this.configuration.type,
        mainId: this.mainId
      },
      header: rowData['_repr_'] + ' bearbeiten',
      width: '500px'
    });

    this.subscriptions.push(
      dialogRef.onClose.pipe(
        switchMap((fields: Field[]) => fields ? this.entityService.updateEntity(this.configuration.type, rowData['id'], fields) : EMPTY)).subscribe(
          () => {
            this.loadLazy(this.lastLazyLoadEvent);
            this.entityOperation.emit(null);
          },
          error => console.error('[Dynamic-Table] Method updateEntity failed!\n' + error)
        )
    );

  }

  // covers multiple scenarios:
  // 1a) File entity: create new file:                ownerId: undefined   ownerType: undefined   fileId: undefined
  // 1b) File entity: update existing file:           ownerId: undefined   ownerType: undefined   fileId: set
  // 2a) FileAttachment entity: create new file:      ownerId: set         ownerType: set         fileId: undefined
  // 2b) FileAttachment entity: update existing file: ownerId: set         ownerType: set         fileId: set
  // FileUploadDialogComponent decides depending on these parameters what to do (attach yes/no, update/create)
  uploadFile(ownerId?: number, ownerType?: string, fileId?: number, fileType?: string) {

    const dialogRef = this.dialogService.open(FileUploadDialogComponent, {
      data: {
        catalogueName: 'FILE_TYPES',
        catalogueDisplayName: 'Dateityp',
        ownerId: ownerId,
        ownerType: ownerType,
        fileId: fileId,
        fileType: fileType,
        attachmentCategory: this.attachmentCategory
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
        this.subscriptions.push(
          this.entityService.deleteEntity(this.configuration.type, data['id']).subscribe(() => {
            this.loadLazy(this.lastLazyLoadEvent);
            this.entityOperation.emit(null);
          })
        );
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
    if (this.configuration.minWidth && width < this.configuration.minWidth) {
      if (this.crudColumnSpace === undefined) {
        this.crudColumnSpace = this.calcCrudColWidth(this.entityData.maxActionNumber);
      }

      width = this.configuration.minWidth - (this.showButtons ? this.crudColumnSpace : 0) - this.minTableWidth;
      if (!col.width) {
        return Math.floor(this.freeColumnSpace / this.zeroWidthColumns * width / 100.0) + 'px';
      } else if (col.width.endsWith('px')) {
        return col.width;
      } else {
        return Math.floor(Number.parseInt(col.width, 10) * width / 100.0) + 'px';
      }
    } else {
      return col.width;
    }

  }

  calcCrudColWidth(actionCount: number): number {
    // width required to display action icons, per Icon 32px required, additional offset of 2x13px for margin
    // if there is no actionCount (empty table) just return 90px
    return actionCount ? (actionCount * 32) + 26 : 90;
  }

  executeAction(actionHrid: string, dtoType: string, entityId: number, suppressOutput?: boolean) {
    const payload: ScriptActionPayload = { actionHrid: actionHrid, entityReference: { dtoType: dtoType, id: entityId } };

    // run getAction API to retrieve information (HRID and params) required to execute the action
    this.subscriptions.push(
      this.entityService.getAction(payload).subscribe((actionDetails: ScriptActionDefinition) => {
        payload.actionHrid = actionDetails.actionHrid; // prepare payload for executeAction (add HRID)

        if (actionDetails.params.length > 0) {  // if there are params to be specified open entity dialog
          const dialogRef = this.dialogService.open(EntityDialogComponent, {
            data: {
              update: true,
              fields: actionDetails.params,
              configType: this.configuration.type,
              mainId: this.mainId,
            },
            header: 'Aktionsparameter',
            width: '500px'
          });

          this.subscriptions.push(
            dialogRef.onClose.subscribe((fields: Field[]) => {
              if (fields) {  // in case the dynamicDialog is closed via "x" at top right corner, nothing is returned
                this.loading = true;
                payload.params = fields;
                this.entityService.executeAction(payload, false).subscribe(
                  (result) => {
                    this.loadLazy(this.lastLazyLoadEvent);
                    if (!suppressOutput) { this.showActionResult(actionDetails.name, result['result'], result['output'], true, actionDetails.showResult); }
                  },
                  error => this.showActionResult(actionDetails.name, error.error.message, error.error.trace, false, true)
                );
              }
            })
          );

          // if there are no params do not make any turnarounds and just go!
        } else {
          this.loading = true;
          this.entityService.executeAction(payload, false).subscribe(
            result => {
              this.loadLazy(this.lastLazyLoadEvent);
              if (!suppressOutput) { this.showActionResult(actionDetails.name, result['result'], result['output'], true, actionDetails.showResult); }
            },
            error => this.showActionResult(actionDetails.name, error.error.message, error.error.trace, false, true)
          );
        }
      })
    );
  }

  showActionResult(actionName: string, result: string, output: string, success: boolean, showResult: boolean) {
    if (!showResult && success) {
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
    this.entitySelectionTableData = new TableData(field.referenceType, field.referenceType)
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
    if (!event || event.relatedTarget === undefined || event.relatedTarget === null || event.relatedTarget['id'] !== this.cellEditCache.field + '§' + rowData['id']) {
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

  initCellEdit(cellRef, field, rowData) {
    // If another cell is being edited abort the edit operation and initialize the new edit operation
    if (this.lastCellRef !== undefined && this.cellEditCache !== undefined) {
      const rowDataPrev = this.entityData.data.find(row => row['id'] === this.cellEditCache.data['id']);
      rowDataPrev[this.cellEditCache.field.field] = this.cellEditCache.data[this.cellEditCache.field.field];
      this.lastCellRef.isEdited = false;
    }

    // in case of entity selection open dialog directly
    if (Field.isReference(field) && !Field.isCatalogueEntry(field)) {
      this.openEntitySelectionDialog(field, rowData['id']);
      return;
    }
    // in case of code edit open code editor directly
    if (field.type === 'python' || field.type === 'json') {
      this.openCodeEditor(rowData, field.type, field.field);
      return;
    }
    // Register scroll handler in order to abort edit in case of scrolling
    if (field.type === 'Date') {
      this.dynamicTableRef.nativeElement.querySelector('div.ui-table-scrollable-body').addEventListener('scroll', (ev: Event) => this.abortCellEdit(rowData, null), { once: true });
    }

    this.cellEditCache = { field: field.field, data: Object.assign({}, rowData) };
    cellRef.isEdited = true;
    this.lastCellRef = cellRef;

  }

  completeCellEdit(data) {
    this.lastCellRef = undefined;
    this.cellEditCache = undefined;

    const dateFields: Field[] = [];
    this.configuration.fields.forEach(field => {
      if (field.type === 'Date') {
        dateFields.push(field);
        if (data[field.field] !== null) {
          data[field.field] = new Date(data[field.field]).toISOString();
        }
      }

      if (field.alternativeFieldForEditing) {
        data[field.alternativeFieldForEditing] = data[field.field];
      }
    });

    this.entityService.updateEntity(this.tableData.entityType, data['id'], data).subscribe(result => {
      const index = this.entityData.data.findIndex(data_ => data_['id'] === result['fields']['id']);
      dateFields.forEach(field => {
        if (result['fields'][field.field] !== null) {
          result['fields'][field.field] = new Date(result['fields'][field.field]);
        }
      });
      this.entityData.data[index] = result['fields'];
      this.entityOperation.emit(null);
    }, error => this.refreshTableContents());
  }

  showDropdown(rowData, dd) {
    const dropdown = dd.el.nativeElement;
    const rect = dropdown.getBoundingClientRect();

    this.dynamicTableRef.nativeElement.querySelector('div.ui-table-scrollable-body').addEventListener('scroll', (ev: Event) => this.abortCellEdit(rowData, null), { once: true });

    document.body.append(dropdown);
    dropdown.style.position = 'absolute';
    dropdown.style.left = rect.left + 'px';
    dropdown.style.top = rect.top + window.pageYOffset + 'px';
    dropdown.style.width = rect.width + 'px';
  }

  openCodeEditor(data: any, syntax: string, field: string) {
    const dialogRef = this.dialogService.open(CodeEditorComponent, {
      data: {
        syntax: syntax,
        code: data[field]
      },
      header: syntax + ' Code Editor',
      width: '80%'
    });

    this.subscriptions.push(
      dialogRef.onClose.subscribe((code: string) => {
        data[field] = code;
        // pass entity with edited code (data) to inline edit save routine
        this.completeCellEdit(data);
      })
    );
  }

  filterAreActive() {
    return this.filtersInTable || !!this.selectedId;
  }

  resetFilter() {
    if (!!this.selectedId) {
      this.selectedId = undefined;
      this.jmlNavigationService.clearId(this.router);
      // this.router.navigate([])
    }
  }

  _isCatalogueEntry(field: Field): boolean {
    return Field.isCatalogueEntry(field);
  }

}
