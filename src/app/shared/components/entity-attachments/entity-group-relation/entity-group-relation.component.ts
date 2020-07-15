import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EntityService } from 'src/app/shared/services/entity.service';
import { GroupConfiguration } from 'src/app/shared/models/group-configuration';
import { EntityData } from 'src/app/shared/models/entity-data';

import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromConfigSelectors from 'src/app/root-store/config-store/config.selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-entity-group-relation',
  templateUrl: './entity-group-relation.component.html',
  styleUrls: ['./entity-group-relation.component.css']
})
export class EntityGroupRelationComponent implements OnChanges {
  @Input() ownerType: string;
  @Input() ownerId: number;
  @Input() relation: string;

  // Contains all entities, that the currently selected entity is member of for each group relation
  groupMembers: any[] = [];
  // Contains all members available for each group relation
  allGroupMembers: EntityData;
  // Contains all members which are not held by the selected entity for each group relation
  nonGroupMembers: any[] = [];

  groupConfig: GroupConfiguration;

  constructor(private entityService: EntityService, private store$: Store<RootStoreState.State>) { }

  init() {
    if (this.ownerType && this.relation) {
      const groupConfigurations$ = this.store$.pipe(
        select(fromConfigSelectors.selectGroupConfigs),
        map(configs => configs[this.relation])
      );
      groupConfigurations$.subscribe(groupConfig => {
        this.groupConfig = groupConfig;
        this.entityService.filter(groupConfig.member, 1, 2147483647, undefined, '', '').subscribe(allMembers => {
          this.allGroupMembers = allMembers;
          if (this.ownerId) {
            this.getGroupMembers();
          }
        });
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ownerType || (!this.allGroupMembers && this.ownerType)) {
      this.init();
    } else if (changes.ownerId) {
      this.getGroupMembers();
    }
  }

  getGroupMembers() {
    this.groupMembers = [];
    this.entityService.membersGroup(this.relation, this.ownerId).subscribe(members => {
      this.groupMembers = members.data;
      const memberIds: Set<number> = new Set(members.data.map( m => m.id ));
      // deep copy of entities + filtering for non-members
      this.nonGroupMembers = this.allGroupMembers.data.filter( (d: any) => !memberIds.has(d['id'])).map( (d: any) => ({ ...d }) );
    });
  }

  async addMembers(items: any[]) {
    items.forEach(item =>
      this.entityService.addMember(this.relation, this.ownerId, item['id']).subscribe());
  }

  async removeMembers(items: any[]) {
    items.forEach(item =>
      this.entityService.removeMember(this.relation, this.ownerId, item['id']).subscribe());
  }
}
