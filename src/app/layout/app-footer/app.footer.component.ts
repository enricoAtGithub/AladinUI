import { Component, OnInit } from '@angular/core';
import { AppConfig, ServerInfo, UIInfo } from 'src/app/shared/app-config';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './app.footer.component.html'
})
export class AppFooterComponent implements OnInit {
  uiDetails: string;
  beDetails: string;
  company: {
    name: string,
    street: string,
    city: string,
    email: string
  };
  appName: string;


  constructor(private appConfig: AppConfig) {
    this.company = {
      name: environment.companyName,
      street: environment.companyStreet,
      city: environment.companyCity,
      email: environment.companyEmail
    };
    this.appName = environment.appName;
    this.uiDetails = '...loading UI details';
    this.beDetails = 'loading BE details....';
  }

  ngOnInit() {
    // console.log('[AppFooterComponent-ngOnInit]');
    AppConfig.uiInfo$.subscribe(uiInfo => {
      this.uiDetails = 'UI version=' + uiInfo.version + '.' + uiInfo.git_branch + '.' + uiInfo.build_no + '.' + uiInfo.git_sha;
    });
    AppConfig.serverInfo$.subscribe(serverInfo => {
      // happens after uiInfo subscription has fired.
      this.beDetails = 'BE host=' + serverInfo.host + ', BE version=' + serverInfo.version;
    });
  }
}
