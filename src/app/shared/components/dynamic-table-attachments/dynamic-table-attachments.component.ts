import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EntityConfiguration, EntityAttachment } from '../../models/entity-configuration';
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

  configuration: EntityConfiguration;
  tabViewAttachments: EntityAttachment[];
  panelAttachments: EntityAttachment[];
  hasContent: boolean;

  selectedPanel: string;

  constructor(public dialogService: DialogService, private store$: Store<RootStoreState.State>) { }

  init() {
    const configuration$: Observable<EntityConfiguration> = this.store$.pipe(
      select(fromConfigSelectors.selectConfigs),
      map(configs => configs[this.configName])
    );

    configuration$.subscribe(config => {
      config.entityAttachments ? this.hasContent = true : this.hasContent = false;

      if (this.hasContent) {
        this.tabViewAttachments = config.entityAttachments.filter(entityAttachment => entityAttachment.appearance === 'tabView');

        this.panelAttachments = config.entityAttachments.filter(entityAttachment => entityAttachment.appearance === 'panel');

        const tabViewGroupAttachments: EntityAttachment[] = this.tabViewAttachments.filter(entityAttachment => entityAttachment.type === 'group');
        if (tabViewGroupAttachments) {
          tabViewGroupAttachments.some(group => {
            if (!this.excludedPanels || (this.excludedPanels && !this.excludedPanels.includes(group.name))) {
              this.selectedPanel = group.name;
              return true;
            }
          });
        }

        const tabViewAttrGroupAttachments: EntityAttachment[] = this.tabViewAttachments.filter(entityAttachment => entityAttachment.type === 'attributeGroup');
        if (!this.selectedPanel && tabViewAttrGroupAttachments) {
          tabViewAttrGroupAttachments.some(attributeGroup => {
            if (!this.excludedPanels || (this.excludedPanels && !this.excludedPanels.includes(attributeGroup.name))) {
              this.selectedPanel = attributeGroup.name;
              return true;
            }
          });
        }

        const tabViewComponentAttachments: EntityAttachment[] = this.tabViewAttachments.filter(entityAttachment => entityAttachment.type === 'component');
        if (!this.selectedPanel && tabViewComponentAttachments) {
          tabViewComponentAttachments.some(component => {
            if (!this.excludedPanels || (this.excludedPanels && !this.excludedPanels.includes(component.name))) {
              this.selectedPanel = component.name;
              return true;
            }
          });
        }

        const tabViewSubentityAttachments: EntityAttachment[] = this.tabViewAttachments.filter(entityAttachment => entityAttachment.type === 'subentity');
        if (!this.selectedPanel && tabViewSubentityAttachments) {
          tabViewSubentityAttachments.some(subentity => {
            if (!this.excludedPanels || (this.excludedPanels && !this.excludedPanels.includes(subentity.name))) {
              this.selectedPanel = subentity.name;
              return true;
            }
          });
        }
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
      if (!changes.configName.firstChange) {
        this.init();
      }
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
