import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { EntityConfiguration } from '../../models/entity-configuration';
import { DialogService } from 'primeng/api';

import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromConfigSelectors from 'src/app/root-store/config-store/selectors';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-table-attachments',
  templateUrl: './dynamic-table-attachments.component.html',
  styleUrls: ['./dynamic-table-attachments.component.css']
})
export class DynamicTableAttachmentsComponent implements OnInit, OnChanges {
  @Input() configName: string;
  @Input() entryId: number;

  isEmpty: boolean;
  hasContent: boolean;
  showActionTab = false;

  configuration: EntityConfiguration;

  constructor(private entityService: EntityService, public dialogService: DialogService, private store$: Store<RootStoreState.State>) { }

  init() {
    const configuration$: Observable<EntityConfiguration> = this.store$.pipe(
      select(fromConfigSelectors.selectConfigs),
      map(configs => configs[this.configName])
    );
    configuration$.subscribe(config => {
      this.configuration = config;
      this.hasContent = !!config.components || config.groups !== null || config.subtypes !== null;

      if (this.configName === 'SecurityRight') {
        this.showActionTab = true;
      }
      this.isEmpty = !this.hasContent && !this.showActionTab;
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

}
