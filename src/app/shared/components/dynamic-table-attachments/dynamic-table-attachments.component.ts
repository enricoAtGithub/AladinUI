import { Component, OnInit, Input } from '@angular/core';
import { TableData } from '../../models/table-data';
import { Observable } from 'rxjs';
import { GroupConfiguration } from '../../models/group-configuration';
import { EntityService } from '../../services/entity.service';
import { GroupMembers } from '../../models/group-members';
import { EntityData } from '../../models/entity-data';
import { EntityConfiguration } from '../../models/entity-configuration';

@Component({
  selector: 'app-dynamic-table-attachments',
  templateUrl: './dynamic-table-attachments.component.html',
  styleUrls: ['./dynamic-table-attachments.component.css']
})
export class DynamicTableAttachmentsComponent implements OnInit {
  @Input() tableData: TableData;
  @Input() $configuration: Observable<EntityConfiguration>;
  @Input() $entryId: Observable<number>;

  configuration: EntityConfiguration;
  entryId: number;
  groupConfigsArray: GroupConfiguration[] = [];
  groupConfigurations: Map<string, GroupConfiguration> = new Map();
  // Contains all entities, that the currently selected entity is member of for each group relation; implicitly ordered by index
  groupMembers: Map<string, GroupMembers> = new Map();
  // Contains all members available for each group relation; implicitly ordered by inde
  allGroupMembers: Map<string, EntityData> = new Map();
  // Contains all members which are not held by the selected entity for each group relation; implicitly ordered by index
  nonGroupMembers: Map<string, EntityData> = new Map();

  logTableData: TableData;

  constructor(private entityService: EntityService) { }

  ngOnInit() {
    this.$configuration.subscribe(config => {
      this.configuration = config;
      // Get relevant group configurations if available
      if (this.configuration.groups !== null) {
        this.entityService.getGroupConfigurations().subscribe((allConfigs: GroupConfiguration[]) => {
          for (const group of this.configuration.groups) {
            this.groupConfigurations.set(group, allConfigs[group]);
            this.groupConfigsArray.push(allConfigs[group]);
            this.entityService.filter(allConfigs[group].member, 1, 2147483647, '', '')
              .subscribe(allMembers => this.allGroupMembers.set(group, allMembers));
          }
        });
      }

      this.$entryId.subscribe(entryId => {
        this.entryId = entryId;

        this.logTableData = new TableData('Logs', 'LogEntry', false, false, false, true, false,
        '/log/entries/Glass/' + this.entryId, '175px');

        if (this.groupConfigurations) {
          this.groupMembers.clear();
          this.allGroupMembers.forEach((value, key) => this.nonGroupMembers.set(key, {...value}));

          this.groupConfigurations.forEach(groupConfig => {
            this.entityService.membersGroup(groupConfig.type, entryId).subscribe(members => {
              this.groupMembers.set(groupConfig.type, members);

              // Filter out the members which the groupholder already has
              members.data.forEach(e => {
                this.nonGroupMembers.get(groupConfig.type).data = this.nonGroupMembers.get(groupConfig.type).data.filter((value) => {
                  if (value['id'] === e['id']) { return false; }
                  return true;
                });
              });
            });
          });
        }
      });
    });
  }

  async addMembers(items: any[], groupTypeName: string) {
    items.forEach(item =>
      this.entityService.addMember(this.groupConfigurations.get(groupTypeName).type, this.entryId, item['id']).subscribe());
  }

  async removeMembers(items: any[], groupTypeName: string) {
    items.forEach(item =>
      this.entityService.removeMember(this.groupConfigurations.get(groupTypeName).type, this.entryId, item['id']).subscribe());
  }

}
