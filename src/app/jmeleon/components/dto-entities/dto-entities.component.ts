import { Component, OnInit, ViewChild } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { SelectItem } from 'primeng/api';
import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromConfigSelectors from 'src/app/root-store/config-store/selectors';

@Component({
  selector: 'app-dto-entities',
  templateUrl: './dto-entities.component.html',
  styleUrls: ['./dto-entities.component.css']
})
export class DTOEntitiesComponent implements OnInit {
  data: TableData; 
  dtoConfigs: SelectItem[];
  currentConfig: string;


  constructor(private store$: Store<RootStoreState.State>) { }

  configToSelectItem(name: string, type: string): SelectItem {
    return {label: name, value: type};
  }

  ngOnInit() {
    const configurations$ = this.store$.pipe(select(fromConfigSelectors.selectConfigs));
    configurations$.subscribe(configs => {
      this.dtoConfigs = Object.values(configs).map(config => this.configToSelectItem(config.type, config.type));
    });
  }

  selectedConfigChanged(event) {
    if (this.data != null) 
        this.data = null
    else {
        this.currentConfig = event['value'];
        this.data = new TableData('', this.currentConfig);
    }

  }
}
