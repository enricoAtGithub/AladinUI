import { Component } from '@angular/core';
import { MessageService } from 'primeng/primeng';
import { ErrorNotificationService } from './shared/services/error-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  constructor(private messageService: MessageService, private errorNotificationService: ErrorNotificationService) {
    this.errorNotificationService.notificationQueue$.subscribe(notification => {
      this.messageService.add({severity: notification.severity, summary: notification.summary, detail: notification.detail, life: notification.life});
    });
  }
}
