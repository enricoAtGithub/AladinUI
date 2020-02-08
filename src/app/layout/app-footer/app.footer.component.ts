import { Component, OnInit } from '@angular/core';
import { AppConfig, ServerInfo, UIInfo } from 'src/app/shared/app-config';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './app.footer.component.html'
})
export class AppFooterComponent implements OnInit {
  appDetails: string;
  companyName: string;
  appName: string;

  constructor(private appConfig: AppConfig) {
    this.companyName = environment.companyName;
    this.appName = environment.appName;
  }

  ngOnInit() {
    const uiInfo: UIInfo = AppConfig.getUIInfo();
    const uiDetails = 'UI version=' + uiInfo.version + '.' + uiInfo.git_branch + '.' + uiInfo.build_no + '.' + uiInfo.git_sha;
    this.appDetails = uiDetails + ', loading BE details....';
    this.appConfig.serverInfo( (serverInfo: ServerInfo) => {
      this.appDetails = uiDetails + ', BE host=' + serverInfo.host + ', BE version=' + serverInfo.version;
    } );
  }
}
