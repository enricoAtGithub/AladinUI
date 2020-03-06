import { Component, OnInit, ViewChild } from '@angular/core';
import { EntityService } from 'src/app/shared/services/entity.service';
import { SelectItem } from 'primeng/api';
import { AceComponent, AceDirective, AceConfigInterface } from 'ngx-ace-wrapper';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import { ErrorNotificationService } from 'src/app/shared/services/error-notification.service';
import { ErrorMessage } from 'src/app/shared/models/error-message';



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
  
  constructor(private entityService: EntityService, private notificationService: ErrorNotificationService) { }

  configToSelectItem(name: string, type: string): SelectItem {
    return {label: name, value: type};
  }

  ngOnInit() {
    this.entityService.getEntityConfigurations().subscribe(configs => {
      this.dtoConfigs = Object.values(configs).map(config => this.configToSelectItem(config.displayName, config.type));
    });
  }

  selectedConfigChanged(event) {
    this.enableEditor = true;
    this.currentConfigName = event['value'];
    this.entityService.getEntityConfigurationFile(this.currentConfigName).subscribe(config => this.currentConfig = config['content']);
  }

  saveConfig() {
    this.entityService.updateEntityConfigurationFile(this.currentConfigName, this.currentConfig).subscribe(() =>
      this.notificationService.addSuccessNotification(new ErrorMessage('success', 'Success!', 'The configuration has been saved.' )));
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
