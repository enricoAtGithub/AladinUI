import { Component, OnInit, ChangeDetectorRef, Input} from '@angular/core';
import { EntityConfiguration } from '../../models/entity-configuration';
import { Field } from '../../models/field';
import { EntityData } from '../../models/entity-data';
import { EntityService } from '../../services/entity.service';
import { LazyLoadEvent, DialogService, ConfirmationService } from 'primeng/primeng';
import { TableData } from '../../models/table-data';
import { EntityDialogComponent } from '../entity-dialog/entity-dialog.component';
import { Observable } from 'rxjs';
import { GroupConfiguration } from '../../models/group-configuration';
import { GroupMembers } from '../../models/group-members';
import { Catalogue } from '../../models/catalogue';
import { CatalogueService } from 'src/app/user/services/catalogue.service';
import { ErrorNotificationService } from '../../services/error-notification.service';
import { ErrorMessage } from '../../models/error-message';
import { delay } from 'q';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
  providers: [ConfirmationService]
})
export class DynamicTableComponent implements OnInit {
  @Input() tableData: TableData;

  configuration: EntityConfiguration;
  groupConfigsArray: GroupConfiguration[] = [];
  groupConfigurations: Map<string, GroupConfiguration> = new Map();
  // Contains all entities, that the currently selected entity is member of for each group relation; implicitly ordered by index
  groupMembers: Map<string, GroupMembers> = new Map();
  // Contains all members available for each group relation; implicitly ordered by inde
  allGroupMembers: Map<string, EntityData> = new Map();
  // Contains all members which are not held by the selected entity for each group relation; implicitly ordered by index
  nonGroupMembers: Map<string, EntityData> = new Map();
  // All catalogues which are relevant to the entity configuration
  catalogues: Map<string, Catalogue> = new Map();
  catalogueCount = 0;
  fields: Field[];
  loading = false;
  entityData: EntityData;
  selectedEntry: any;
  lastLazyLoadEvent: LazyLoadEvent;

  constructor(private entityService: EntityService, private cd: ChangeDetectorRef,
    private dialogService: DialogService, private confirmationService: ConfirmationService,
    private catalogueService: CatalogueService, private errorNotificationService: ErrorNotificationService) {}

  ngOnInit() {
    this.configuration = new EntityConfiguration();
    this.entityData = new EntityData();
    this.entityService.getEntityConfigurations().subscribe(async configs => {
      // Get the config according to the given name
      const config = configs[this.tableData.configName];
      if (config === undefined) {
        return;
      }

      const fields = config.fields.filter(field => field.visible === true);

      fields.forEach(field => {
        if (field.type === 'CatalogueEntry') {
          this.catalogueCount++;
          this.catalogueService.getCatalogue(field.defaultCatalogue).subscribe(cat => this.catalogues.set(field.defaultCatalogue, cat));
        }
      });

      // Get relevant group configurations if available
      if (config.groups !== null) {
        this.entityService.getGroupConfigurations().subscribe((allConfigs: GroupConfiguration[]) => {
          for (const group of config.groups) {
            this.groupConfigurations.set(group, allConfigs[group]);
            this.groupConfigsArray.push(allConfigs[group]);
            this.entityService.filter(allConfigs[group].member, 1, 2147483647, '', '')
              .subscribe(allMembers => this.allGroupMembers.set(group, allMembers));
          }
        });
      }

      this.configuration = config;
      this.fields = config.fields.filter(field => field.visible === true);
    });
  }

  async rowSelect(event) {
    if (!this.groupConfigurations) {
      return;
    }
    this.groupMembers.clear();
    this.allGroupMembers.forEach((value, key) => this.nonGroupMembers.set(key, {...value}));

    this.groupConfigurations.forEach(config => {
      this.entityService.membersGroup(config.type, this.selectedEntry['id']).subscribe(members => {
        this.groupMembers.set(config.type, members);

        // Filter out the members which the groupholder already has
        members.data.forEach(e => {
          this.nonGroupMembers.get(config.type).data = this.nonGroupMembers.get(config.type).data.filter((value) => {
            if (value['id'] === e['id']) { return false; }
            return true;
          });
        });
      });
    });
  }

  async addMembers(items: any[], groupTypeName: string) {
    items.forEach(item =>
      this.entityService.addMember(this.groupConfigurations.get(groupTypeName).type, this.selectedEntry['id'], item['id']).subscribe());
  }

  async removeMembers(items: any[], groupTypeName: string) {
    items.forEach(item =>
      this.entityService.removeMember(this.groupConfigurations.get(groupTypeName).type, this.selectedEntry['id'], item['id']).subscribe());
  }

  async refreshTableContents() {
    this.loadLazy(this.lastLazyLoadEvent);
  }

  async loadLazy(event: LazyLoadEvent) {
    // Check if the configuration data requested in ngOnInit has already been reveived
    let timeout = 5000;
    while ((!this.catalogues || this.catalogueCount !== this.catalogues.size || !this.fields) && timeout !== 0) {
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
    this.cd.detectChanges();

    let sorting = '';
    let qualifier = '';

    this.fields.forEach(field => {
      if (event.filters[field.field]) {
        qualifier += 'LIKE(\'' + field.header + '\',\'%' +  event.filters[field.field].value + '%\'),';
      }
    });

    const sort = this.fields.find(field => {if (field.field === event.sortField) {return true; }});

    if (sort) {
      if (event.sortOrder === 1) {
        sorting += 'ASC(\'' + sort.header + '\')';
      } else {
        sorting += 'DESC(\'' + sort.header + '\')';
      }
    }

    let page = 1;
    if (this.configuration.rowsPerPage) {
      page = event.first / <number>this.configuration.rowsPerPage + 1;
    }

    if (this.tableData.explicitUrl === undefined) {
      this.entityService.filter(this.tableData.configName, page, 10, qualifier, sorting)
        .subscribe(data => { this.entityData = data; this.loading = false; });
    } else {
      this.entityService.getEntityDataFromUrl(this.tableData.explicitUrl)
        .subscribe(data => { this.entityData = data; this.loading = false; });
    }
  }

  processData(input: any, field: Field): string {
    switch (field.type) {
      case 'Date':
        return this.processDate(new Date(input));
      case 'boolean':
        return input ? '✓' : '🞩';
      default:
        return input;
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
      width: '25%'
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
      header: 'Bearbeiten',
      width: '25%'
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

}
