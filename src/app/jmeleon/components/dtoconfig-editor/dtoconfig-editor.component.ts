import { Component, OnInit, ViewChild } from '@angular/core';
import { EntityService } from 'src/app/shared/services/entity.service';
import { SelectItem } from 'primeng/api';
import { AceComponent, AceConfigInterface } from 'ngx-ace-wrapper';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import { ErrorNotificationService } from 'src/app/shared/services/error-notification.service';

import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromConfigSelectors from 'src/app/root-store/config-store/config.selectors';



@Component({
  selector: 'app-dtoconfig-editor',
  templateUrl: './dtoconfig-editor.component.html',
  styleUrls: ['./dtoconfig-editor.component.css']
})
export class DTOConfigEditorComponent implements OnInit {
  @ViewChild(AceComponent, { static: false }) componentRef ?: AceComponent;

  dtoConfigs: SelectItem[];
  currentConfig: string;
  currentConfigName: string;
  enableEditor = false;

  public aceconfig: AceConfigInterface = {
    mode: 'json',
    theme: 'github',
    readOnly : false
  };

  constructor(private entityService: EntityService, private notificationService: ErrorNotificationService, private store$: Store<RootStoreState.State>) { }

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
    this.enableEditor = true;
    this.currentConfigName = event['value'];
    this.entityService.getEntityConfigurationFile(this.currentConfigName).subscribe(config => this.currentConfig = config['content']);
  }

  saveConfig() {
    this.entityService.updateEntityConfigurationFile(this.currentConfigName, this.currentConfig).subscribe(() =>
      this.notificationService.addSuccessNotification('Success!', 'The configuration has been saved.' ));
  }

  public onEditorBlur(event: any): void {
    // console.log('Editor blur:', event);
  }

  public onEditorFocus(event: any): void {
    // console.log('Editor focus:', event);
  }

  public onValueChange(value: string): void {
    // console.log('Value change:', value);
  }

  public onContentChange(event: any): void {
    // console.log('Content change:', event);
  }

  public onSelectionChange(event: any): void {
    // console.log('Selection change:', event);
  }

}
