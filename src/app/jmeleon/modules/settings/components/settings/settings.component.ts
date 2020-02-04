import { Component, OnInit } from '@angular/core';
import { CategoryModel } from '../../models/category.model';
import { SettingsService } from '../../services/settings.service';
import { Observable } from 'rxjs';
import { SettingsModel } from '../../models/setting.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  categories: CategoryModel[];
  categories$: Observable<CategoryModel[]>;
  activeEditSetting: string;
  constructor(
    private settingService: SettingsService
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
    this.activeEditSetting = setting.name;
  }
  cancelEdit(setting: SettingsModel) {
    this.activeEditSetting = null;
  }

}
