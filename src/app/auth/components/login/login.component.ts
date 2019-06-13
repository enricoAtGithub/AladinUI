import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { AppConfig, ServerInfo, UIInfo } from 'src/app/shared/app-config';
import { HttpClient } from '@angular/common/http';
import { UrlCollection } from 'src/app/shared/url-collection';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  msgs: Message[] = [];
  loginFailed = false;

  uiDetails: string;
  appDetails: string;

  constructor(public authService: AuthService, public router: Router, private appConfig: AppConfig) {}

  ngOnInit() {
    var uiInfo: UIInfo = AppConfig.getUIInfo();
    this.uiDetails = "UI version=" + uiInfo.version + "." + uiInfo.git_branch + "." + uiInfo.build_no + "." + uiInfo.git_sha;
    this.appDetails = this.uiDetails + ", loading BE details....";
    this.appConfig.serverInfo( (serverInfo: ServerInfo) => {this.appDetails = this.uiDetails + ", BE host="+serverInfo.host+", BE version="+serverInfo.version;} );
  }


  login(user, pass) {
    this.authService.login(user.value, pass.value).subscribe(success => {
      if (!success) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: 'An error occured while trying to connect to the server' });
        return;
      }

      if (success === true) {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        const redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/dashboard';

        // Redirect the user
        this.router.navigateByUrl(redirect);
      } else {
        this.loginFailed = true;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: success.toString() });
      }
    });
  }
}
