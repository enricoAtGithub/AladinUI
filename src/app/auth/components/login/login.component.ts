import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { AppConfig, ServerInfo, UIInfo } from 'src/app/shared/app-config';

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
    const uiInfo: UIInfo = AppConfig.getUIInfo();
    this.uiDetails = 'UI version=' + uiInfo.version + '.' + uiInfo.git_branch + '.' + uiInfo.build_no + '.' + uiInfo.git_sha;
    this.appDetails = this.uiDetails + ', loading BE details....';
    this.appConfig.serverInfo( (serverInfo: ServerInfo) => {
      this.appDetails = this.uiDetails + ', BE host=' + serverInfo.host + ', BE version=' + serverInfo.version;
    } );
  }


  login(user: { value: string; }, pass: { value: string; }) {
    this.authService
      .login(user.value, pass.value)
      .subscribe(([success, errMsg]): [boolean, string] => {
        if (!success) {
          this.msgs = [];
          if (!errMsg) {
            errMsg = 'An error occurred while trying to connect to the server';
          }
          this.msgs.push({ severity: 'error', summary: '', detail: errMsg });
          return;

        } else {
          // Get the redirect URL from our auth service
          // If no redirect has been set, use the default
          const redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/dashboard';
          // Redirect the user
          this.router.navigateByUrl(redirect);
        }
      });
  }
}
