import { Component, OnInit, ChangeDetectorRef, Input} from '@angular/core';
import { EntityConfiguration } from '../../models/entity-configuration';
import { Field } from '../../models/field';
import { EntityData } from '../../models/entity-data';
import { EntityService } from '../../services/entity.service';
import { LazyLoadEvent, DialogService, ConfirmationService, PickList, PickListModule } from 'primeng/primeng';
import { TableData } from '../../models/table-data';
import { EntityDialogComponent } from '../entity-dialog/entity-dialog.component';
import { Observable } from 'rxjs';
import { GroupConfiguration } from '../../models/group-configuration';
import { GroupMembers } from '../../models/group-members';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
  providers: [ConfirmationService]
})
export class DynamicTableComponent implements OnInit {
  @Input() tableData: TableData;

  configuration: EntityConfiguration;
  groupConfigurations: GroupConfiguration[];
  // Contains all entities, that the currently selected entity is member of for each group relation; implicitly ordered by index
  groupMembers: GroupMembers[];
  // Contains all members available for each group relation; implicitly ordered by inde
  allGroupMembers: EntityData[] = [];
  // Contains all members which are not held by the selected entity for each group relation; implicitly ordered by index
  nonGroupMembers: EntityData[] = [];
  fields: Field[];
  loading = false;
  entityData: EntityData;
  selectedEntry: any;
  lastLazyLoadEvent: LazyLoadEvent;

  constructor(private entityService: EntityService, private cd: ChangeDetectorRef,
    private dialogService: DialogService, private confirmationService: ConfirmationService) {}

  ngOnInit() {

    this.configuration = new EntityConfiguration();
    this.entityData = new EntityData();
    this.entityService.getEntityConfigurations().subscribe(configs => {
      // Get the config according to the given name
      this.configuration = configs[this.tableData.configName];
      this.fields = this.configuration.fields.filter(field => field.visible === true);

      // Get relevant group configurations if available
      if (this.configuration.groups !== null) {
        this.groupConfigurations = [];
        this.entityService.getGroupConfigurations().subscribe((allConfigs: GroupConfiguration[]) => {
          // Go through all available groups and add the ones which are listed in the entities configuration
          for (const key of Object.keys(allConfigs)) {
            if (this.configuration.groups.includes(allConfigs[key].type)) {
              this.groupConfigurations.push(allConfigs[key]);
              // Gruppenkonfigurationen haben immernoch den package klassennamen
              this.entityService.filter(allConfigs[key].member, 1, 100, '', '')
                .subscribe(allMembers => this.allGroupMembers.push(allMembers));
            }
          }
        });
      }
    });
  }

  async rowSelect(event) {
    if (!this.groupConfigurations) {
      return;
    }
    this.groupMembers = [];
    // TODO: remove this
    this.nonGroupMembers = JSON.parse(JSON.stringify(this.allGroupMembers));
    let i = 0;
    this.groupConfigurations.forEach(config => {
      this.entityService.membersGroup(config.type, this.selectedEntry['id']).subscribe(members => {
        this.groupMembers.push(members);

        // Filter out the members which the groupholder already has
        members.data.forEach(e => {
          this.nonGroupMembers[i].data = this.nonGroupMembers[i].data.filter((value) => {
            if (value['id'] === e['id']) { return false; }
            return true;
          });
        });
      i++;
      });
    });
  }

  async addMembers(items: any[], index: number) {
    items.forEach(item =>
      this.entityService.addMember(this.groupConfigurations[index].type, this.selectedEntry['id'], item['id']).subscribe());
  }

  async removeMembers(items: any[], index: number) {
    items.forEach(item =>
      this.entityService.removeMember(this.groupConfigurations[index].type, this.selectedEntry['id'], item['id']).subscribe());
  }

  async loadLazy(event: LazyLoadEvent) {
    this.lastLazyLoadEvent = event;
    this.loading = true;
    this.cd.detectChanges();

    let sorting = '';
    let qualifier = '';

    if (this.fields) {
      this.fields.forEach(field => {
        if (event.filters[<string>field.field]) {
          qualifier += 'LIKE(\'' + field.header + '\',\'%' +  event.filters[<string>field.field].value + '%\'),';
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
    }

    let page = 1;
    if (this.configuration.rowsPerPage) {
      page = event.first / <number>this.configuration.rowsPerPage + 1;
    }

    await this.entityService.filter(this.tableData.configName, page, 10, qualifier, sorting)
      .subscribe(data => this.entityData = data);

    this.loading = false;
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
