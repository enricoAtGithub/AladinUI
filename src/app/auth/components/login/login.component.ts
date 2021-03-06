import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { AppConfig, ServerInfo, UIInfo } from 'src/app/shared/app-config';
// import { RootStoreState, UserProfileActions, UserProfileSelectors, UserProfileState } from 'src/app/root-store/root-index';
// import {UserProfileSelectors} from 'src/app/root-store/user-profile-store/user-profile-index';
import { Store, select } from '@ngrx/store';
// import { selectError } from 'src/app/root-store/root-selectors';
// import { selectError } from 'src/app/root-store/root-selectors';
// import { Observable } from 'bin/node_modules/rxjs';
import { Observable} from 'rxjs';
// import { selectUserProfileError } from 'src/app/root-store/user-profile-store/selectors';
import { environment } from '../../../../environments/environment';
import { AuthFacadeService } from '../../services/auth-facade.service';

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
  private errMsg$: Observable<string>;
  companyName: string;
  appName: string;
  enforcePasswdChange = false;
  safetyBarColor = 'red';
  safetyBarWidth = '0%';
  loginDisabled = false;

  oldpass: string;
  newpass: string;
  repeatpass: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    private appConfig: AppConfig,
    private authFacade: AuthFacadeService
    ) {
    this.companyName = environment.companyName;
    this.appName = environment.appName;
    }

  ngOnInit() {
    AppConfig.uiInfo$.subscribe(uiInfo => {
      // Story #1733: https://redmine.simply4it.de/issues/1733
      this.productiveCheck(uiInfo.FEBEsameURLcheck, window.location.href, uiInfo.baseUrl);

      // console.log('[LoginComponent-ngOnInit-subscribe(uiInfo)]');
      this.uiDetails = 'UI version=' + uiInfo.version + '.' + uiInfo.git_branch + '.' + uiInfo.build_no + '.' + uiInfo.git_sha;
      this.appDetails = this.uiDetails + ', loading BE details....';
      // } );
      // console.log('[LoginComponent-ngOnInit-subscribe(uiInfo)] loading server infos. uiInfo: ', uiInfo);
      // this.appConfig.loadServerInfo();
    });

    AppConfig.serverInfo$.subscribe(serverInfo => {
      // console.log('[LoginComponent-ngOnInit-subscribe(serverInfo)]');
      this.appDetails = this.uiDetails + ', BE host=' + serverInfo.host + ', BE version=' + serverInfo.version;
    });

    this.authFacade.userProfileError$
      .subscribe(errMsg => {
        // console.log('err msg: ', errMsg);
        if (!errMsg) {
          // console.log('empty err msg.');
          return;
        }
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: errMsg });
      });

    this.authFacade.userProfileUser$
      .subscribe(user => {
          if (user && user.user.enforcePasswdChange) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Passwort abgelaufen!', detail: 'Bitte setzen Sie ein neues Passwort' });

            this.enforcePasswdChange = true;
          }
      });
  }

  // Story #1733: https://redmine.simply4it.de/issues/1733
  productiveCheck(executeCheck: boolean, frontendURL: string, backendURL: string) {
    if (!executeCheck) {
      console.log('No productive environment. Compatibility of frontend and backend URL has not been checked.');
      return;
    }

    // get the URL part until the first slash after http://
    const frontendCompString = frontendURL.slice(0 , frontendURL.indexOf('/', (frontendURL.search('://') + 3)));
    const backendCompString = backendURL.slice(0 , backendURL.indexOf('/', (backendURL.search('://') + 3)));

    if (frontendCompString !== backendCompString) {
      console.error(
        'frontend URL: ' + frontendCompString + '\n' +
        'backend URL:  ' + backendCompString + '\n' +
        'Frontend and backend URL mismatch!  Login disabled.');
      this.msgs = [];
      this.msgs.push({ closable: true, severity: 'error', summary: '', detail:
        '<b>Frontend and backend URL mismatch! <br>Login disabled.</b><br>' +
        'frontend URL: ' + frontendCompString + '<br>' +
        'backend URL:  ' + backendCompString + '<br>'
      });
      this.loginDisabled = true;
    } else {
      console.log(
        'frontend URL: ' + frontendCompString + '\n' +
        'backend URL:  ' + backendCompString + '\n' +
        'Success! Frontend and backend URL compatible!'
        );
    }
  }

  login(userName: string, password: string) {
    this.authFacade.login(userName, password);
  }

  changePassword() {
    if (this.newpass !== this.repeatpass) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '', detail: 'Die beiden Passwörter stimmen nicht überein!' });
      return;
    }

    this.authService.changePassword(this.oldpass, this.newpass).subscribe(resp => {
      this.msgs = [];
      if (resp === true) {
        this.msgs.push({ severity: 'success', summary: '', detail: 'Das Passwort wurde erfolgreich geändert!' });
        this.enforcePasswdChange = false;
      } else {
        this.msgs.push({ severity: 'error', summary: '', detail: resp.toString()});
      }
    });
  }

}
