import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { AppConfig, ServerInfo, UIInfo } from 'src/app/shared/app-config';
import { RootStoreState, UserProfileActions, UserProfileSelectors, UserProfileState } from 'src/app/root-store/root-index';
// import {UserProfileSelectors} from 'src/app/root-store/user-profile-store/user-profile-index';
import { Store, select } from '@ngrx/store';
// import { selectError } from 'src/app/root-store/root-selectors';
// import { selectError } from 'src/app/root-store/root-selectors';
// import { Observable } from 'bin/node_modules/rxjs';
import { Observable} from 'rxjs';
// import { selectUserProfileError } from 'src/app/root-store/user-profile-store/selectors';
import { environment } from '../../../../environments/environment';

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

  constructor(
    public authService: AuthService,
    public router: Router,
    private appConfig: AppConfig,
    private store$: Store<RootStoreState.State>) {

    this.companyName = environment.companyName;
    this.appName = environment.appName;
    }

  ngOnInit() {
    AppConfig.uiInfo$.subscribe(uiInfo => {
      // console.log('[LoginComponent-ngOnInit-subscribe(uiInfo)]');
      this.uiDetails = 'UI version=' + uiInfo.version + '.' + uiInfo.git_branch + '.' + uiInfo.build_no + '.' + uiInfo.git_sha;
      this.appDetails = this.uiDetails + ', loading BE details....';
      // } );
      // console.log('[LoginComponent-ngOnInit-subscribe(uiInfo)] loading server infos. uiInfo: ', uiInfo);
      this.appConfig.loadServerInfo();
    });

    AppConfig.serverInfo$.subscribe(serverInfo => {
      // console.log('[LoginComponent-ngOnInit-subscribe(serverInfo)]');
      this.appDetails = this.uiDetails + ', BE host=' + serverInfo.host + ', BE version=' + serverInfo.version;
    });
    // const uiInfo: UIInfo = AppConfig.getUIInfo();
    // console.log('[LoginComponent-ngOnInit]');
    // this.uiDetails = 'UI version=' + uiInfo.version + '.' + uiInfo.git_branch + '.' + uiInfo.build_no + '.' + uiInfo.git_sha;
    // this.appDetails = this.uiDetails + ', loading BE details....';
    // this.appConfig.serverInfo( (serverInfo: ServerInfo) => {
    //   this.appDetails = this.uiDetails + ', BE host=' + serverInfo.host + ', BE version=' + serverInfo.version;
    // } );
    // this.errMsg$ =
    // this.store$
    //   .pipe(select(UserProfileSelectors.selectUserProfileError))
    //   .subscribe(errMsg => {
    //     if (!errMsg) {
    //       console.log('empty err msg.');
    //       return;
    //     }
    //     this.msgs = [];
    //     this.msgs.push({ severity: 'error', summary: '', detail: errMsg });
    //     console.log('err msg: ', errMsg);
    //   });

    this.store$
      .pipe(select(state => UserProfileSelectors.selectUserProfileError(state)))
      .subscribe(errMsg => {
        // console.log('err msg: ', errMsg);
        if (!errMsg) {
          // console.log('empty err msg.');
          return;
        }
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: errMsg });
      });

    this.store$
      .pipe(select(state => UserProfileSelectors.selectUserProfileUser(state)))
      .subscribe(user => {
          if (user && user.user.enforcePasswdChange) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Passwort abgelaufen!', detail: 'Bitte setzen Sie ein neues Passwort' });

            this.enforcePasswdChange = true;
          }
      });
  }

  login(userName: string, password: string) {
    this.store$.dispatch(new UserProfileActions.LoginRequestAction({userName, password}));
  }

  passwordChanged(password: string): void {
    let passwordSafety = 0;
    if (password.length >= 0) {
      passwordSafety += (password.length) * (password.length) / 3;
      if (password !== password.toLowerCase() && password !== password.toUpperCase()) {
        passwordSafety *= 1.5;
      }
      if (password.match(/\d/) !== null) {
        passwordSafety *= 1.2;
      }
      if (password.match(/[^A-Za-z0-9]/) !== null) {
        passwordSafety *= 1.3;
      }
    }

    if (passwordSafety > 100) {
      passwordSafety = 100;
    }
    this.safetyBarColor = 'hsl(' + passwordSafety * 1.2 + ', 100%, 50%)';
    this.safetyBarWidth = passwordSafety + '%';
  }

  changePassword(oldpass, newpass, repeatpass) {
    if (newpass !== repeatpass) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '', detail: 'Die beiden Passwörter stimmen nicht überein!' });
      return;
    }

    this.authService.changePassword(oldpass, newpass).subscribe(resp => {
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
