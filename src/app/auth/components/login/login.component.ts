import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { AppConfig, ServerInfo, UIInfo } from 'src/app/shared/app-config';
import { RootStoreState, UserProfileActions } from 'src/app/root-store/root-index';
import { Store, select } from '@ngrx/store';
import { selectError } from 'src/app/root-store/root-selectors';
// import { Observable } from 'bin/node_modules/rxjs';
import { Observable} from 'rxjs';

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
    this.store$
      .pipe(select(selectError))
      .subscribe(errMsg => {
        if (!errMsg) {
          console.log('empty err msg.');
          return;
        }
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: errMsg });
        console.log('err msg: ', errMsg);
      });

  }


  login(user: { value: string; }, pass: { value: string; }) {
    const userName = user.value;
    const password = pass.value;
    this.store$.dispatch(new UserProfileActions.LoginRequestAction({userName, password}));
  }
}
