import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EntityService } from 'src/app/shared/services/entity.service';
import { GroupConfiguration } from 'src/app/shared/models/group-configuration';
import { EntityData } from 'src/app/shared/models/entity-data';

@Component({
  selector: 'app-entity-group-relation',
  templateUrl: './entity-group-relation.component.html',
  styleUrls: ['./entity-group-relation.component.css']
})
export class EntityGroupRelationComponent implements OnChanges {
  @Input() type: string;
  @Input() entryId: number;
  @Input() relation: string;

  // Contains all entities, that the currently selected entity is member of for each group relation
  groupMembers: any[] = [];
  // Contains all members available for each group relation
  allGroupMembers: EntityData;
  // Contains all members which are not held by the selected entity for each group relation
  nonGroupMembers: any[] = [];

  groupConfig: GroupConfiguration;

  constructor(private entityService: EntityService) { }

  init() {
    if (this.type && this.relation) {
      this.entityService.getGroupConfigurations().subscribe(groupConfigs => {
        this.groupConfig = groupConfigs[this.relation];
        this.entityService.filter(this.groupConfig.member, 1, 2147483647, '', '').subscribe(allMembers => {
          this.allGroupMembers = allMembers;
          if (this.entryId) {
            this.getGroupMembers();
          }
        });
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.type || (!this.allGroupMembers && this.type)) {
      this.init();
    } else if (changes.entryId) {
      this.getGroupMembers();
    }
  }

  getGroupMembers() {
    this.groupMembers = [];
    this.entityService.membersGroup(this.relation, this.entryId).subscribe(members => {
      this.groupMembers = members.data;
      const memberIds: Set<number> = new Set(members.data.map( m => m.id ));
      // deep copy of entities + filtering for non-members
      this.nonGroupMembers = this.allGroupMembers.data.filter( (d: any) => !memberIds.has(d['id'])).map( (d: any) => ({ ...d }) );
    });
  }

  async addMembers(items: any[]) {
    items.forEach(item =>
      this.entityService.addMember(this.relation, this.entryId, item['id']).subscribe());
  }

  async removeMembers(items: any[]) {
    items.forEach(item =>
      this.entityService.removeMember(this.relation, this.entryId, item['id']).subscribe());
  }
}
