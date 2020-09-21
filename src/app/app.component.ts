import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/primeng';
import { ErrorNotificationService } from './shared/services/error-notification.service';
import { RootStoreState, UserProfileActions, UserProfileSelectors, UserProfileState } from 'src/app/root-store/root-index';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  constructor(private messageService: MessageService, private errorNotificationService: ErrorNotificationService,
    private store$: Store<RootStoreState.State>) {
    this.errorNotificationService.notificationQueue$.subscribe(notification => {
      this.messageService.add({severity: notification.severity, summary: notification.summary, detail: notification.detail, life: notification.life});
    });
  }
  ngOnInit(): void {
    // console.log('ngoninit - appcomponent');
    this.store$.dispatch(UserProfileActions.validateTokenRequested());
  }
}
