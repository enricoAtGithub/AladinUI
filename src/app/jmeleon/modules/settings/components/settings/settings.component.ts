import { Component, OnInit } from '@angular/core';
import { CategoryModel } from '../../models/category.model';
import { SettingsService } from '../../services/settings.service';
import { Observable } from 'rxjs';
import { SettingsModel } from '../../models/setting.model';
import { JmeleonActionsFacadeService } from '../../../permissions/services/jmeleon-actions-facade.service';
import { ErrorNotificationService } from 'src/app/shared/services/error-notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  categories: CategoryModel[];
  categories$: Observable<CategoryModel[]>;
  activeEditSetting: string;
  orgSettingValue: string;
  constructor(
    private settingService: SettingsService,
    private notificationService: ErrorNotificationService,
    private jmlActionsFacade: JmeleonActionsFacadeService
  ) { }

  ngOnInit() {
    this.categories = [];
    this.loadSettings();
    this.activeEditSetting = null;
  }

  loadSettings() {
    // this.settingService.getSettings().subscribe(
    //   settings => this.categories = settings
    // );
    this.categories$ = this.settingService.getSettings();
  }


  saveSetting(setting: SettingsModel) {
    this.settingService.setSetting(setting.name, setting.value).subscribe(
      result => {
        if (result) {
          this.activeEditSetting = null;
          this.loadSettings();
        } else {

        }
      }
    );

  }
  setActiveForEdit(setting: SettingsModel) {
    this.orgSettingValue = setting.value;
    this.activeEditSetting = setting.name;
  }
  cancelEdit(setting: SettingsModel) {
    this.activeEditSetting = null;
    setting.value = this.orgSettingValue;
    this.orgSettingValue = null;
  }

  syncGuiActionsWithServer(){
    this.jmlActionsFacade.syncGuiActionsWithServer();
  }

  resetServerSettingsCache() {
    this.settingService.clear().subscribe( () => {
      this.notificationService.addSuccessNotification('Erfolg', 'Settings-Cache geleert')
    } );
  }
}
