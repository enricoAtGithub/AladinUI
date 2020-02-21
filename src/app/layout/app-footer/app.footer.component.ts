import { Component, OnInit } from '@angular/core';
import { AppConfig, ServerInfo, UIInfo } from 'src/app/shared/app-config';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './app.footer.component.html'
})
export class AppFooterComponent implements OnInit {
  uiDetails: string;
  appDetails: string;
  companyName: string;


  constructor(private appConfig: AppConfig) {
    this.companyName = environment.companyName;
    this.uiDetails = '...loading UI details';
  }

  ngOnInit() {
    console.log('[AppFooterComponent-ngOnInit]');
    AppConfig.uiInfo$.subscribe(uiInfo => {
      this.uiDetails = 'UI version=' + uiInfo.version + '.' + uiInfo.git_branch + '.' + uiInfo.build_no + '.' + uiInfo.git_sha;
      this.appDetails = this.uiDetails + ', loading BE details....';
    });
    AppConfig.serverInfo$.subscribe(serverInfo => {
      // happens after uiInfo subscription has fired.
      this.appDetails = this.uiDetails + ', BE host=' + serverInfo.host + ', BE version=' + serverInfo.version;
    });
  }
}
