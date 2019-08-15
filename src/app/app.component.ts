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
    this.errorNotificationService.errorQueue$.subscribe(errorMessage => {
      this.messageService.add({severity: errorMessage.severity, summary: errorMessage.summary, detail: errorMessage.detail, life: 5000});
    });
  }
}
