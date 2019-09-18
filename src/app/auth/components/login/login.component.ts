import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { AppConfig, ServerInfo, UIInfo } from 'src/app/shared/app-config';
import { RootStoreState, UserProfileActions, UserProfileSelectors } from 'src/app/root-store/root-index';
// import {UserProfileSelectors} from 'src/app/root-store/user-profile-store/user-profile-index';
import { Store, select } from '@ngrx/store';
// import { selectError } from 'src/app/root-store/root-selectors';
// import { selectError } from 'src/app/root-store/root-selectors';
// import { Observable } from 'bin/node_modules/rxjs';
import { Observable} from 'rxjs';
// import { selectUserProfileError } from 'src/app/root-store/user-profile-store/selectors';

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

  constructor(
    public authService: AuthService,
    public router: Router,
    private appConfig: AppConfig,
    private store$: Store<RootStoreState.State>) {}

  ngOnInit() {
    const uiInfo: UIInfo = AppConfig.getUIInfo();
    this.uiDetails = 'UI version=' + uiInfo.version + '.' + uiInfo.git_branch + '.' + uiInfo.build_no + '.' + uiInfo.git_sha;
    this.appDetails = this.uiDetails + ', loading BE details....';
    this.appConfig.serverInfo( (serverInfo: ServerInfo) => {
      this.appDetails = this.uiDetails + ', BE host=' + serverInfo.host + ', BE version=' + serverInfo.version;
    } );
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
  }


  login(userName: string, password: string) {
    this.store$.dispatch(new UserProfileActions.LoginRequestAction({userName, password}));
  }
}
