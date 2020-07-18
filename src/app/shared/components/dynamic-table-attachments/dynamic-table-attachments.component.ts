import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EntityConfiguration } from '../../models/entity-configuration';
import { DialogService } from 'primeng/api';

import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromConfigSelectors from 'src/app/root-store/config-store/config.selectors';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroupConfiguration } from '../../models/group-configuration';

@Component({
  selector: 'app-dynamic-table-attachments',
  templateUrl: './dynamic-table-attachments.component.html',
  styleUrls: ['./dynamic-table-attachments.component.css']
})
export class DynamicTableAttachmentsComponent implements OnInit, OnChanges {
  @Input() configName: string;
  @Input() entryId: number;
  @Input() excludedPanels: string[];
  @Input() refreshTrigger: Subject<any>;

  isEmpty: boolean;
  hasContent: boolean;
  showActionTab = false;

  configuration: EntityConfiguration;
  selectedPanel: string;

  constructor(public dialogService: DialogService, private store$: Store<RootStoreState.State>) { }

  init() {
    const configuration$: Observable<EntityConfiguration> = this.store$.pipe(
      select(fromConfigSelectors.selectConfigs),
      map(configs => configs[this.configName])
    );
    configuration$.subscribe(config => {
      this.hasContent = !!config.components || config.groups !== null || config.subtypes !== null;

      if (this.configName === 'SecurityRight') {
        this.showActionTab = true;
      }
      this.isEmpty = !this.hasContent && !this.showActionTab;

      if (config.groups) {
        config.groups.some(group => {
          if (!this.excludedPanels || (this.excludedPanels && !this.excludedPanels.includes(group))) {
            this.selectedPanel = group;
            return true;
          }
        });
      }

      if (!this.selectedPanel && config.components) {
        config.components.some(component => {
          if (!this.excludedPanels || (this.excludedPanels && !this.excludedPanels.includes(component))) {
            this.selectedPanel = component;
            return true;
          }
        });
      }

      if (!this.selectedPanel && config.subtypes) {
        config.subtypes.some(subtype => {
          if (!this.excludedPanels || (this.excludedPanels && !this.excludedPanels.includes(subtype))) {
            this.selectedPanel = subtype;
            return true;
          }
        });
      }

      if (!this.selectedPanel && this.showActionTab) {
        this.selectedPanel = 'Actions';
      }

      this.configuration = config;
    });
  }

  ngOnInit() {
    if (this.configName !== undefined) {
      this.init();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.configName) {
      this.init();
    }
  }

  getSubTypeHeader(subtype: string): Observable<EntityConfiguration> {
    const subTypeConfig$: Observable<EntityConfiguration> = this.store$.pipe(
      select(fromConfigSelectors.selectConfigs),
      map(configs => configs[subtype])
    );
    return subTypeConfig$;
  }

  getGroupHeader(group: string): Observable<GroupConfiguration> {
    const groupConfig$: Observable<GroupConfiguration> = this.store$.pipe(
      select(fromConfigSelectors.selectGroupConfigs),
      map(configs => configs[group])
    );
    return groupConfig$;

  }

}
