import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class ErrorNotificationService {
  public notificationQueue$: Observable<Notification>;
  private notificationQueueSubject: Subject<Notification>;

  constructor() {
    this.notificationQueueSubject = new Subject();
    this.notificationQueue$ = this.notificationQueueSubject.asObservable();
  }

  addErrorNotification(summary: string, detail: string, lifetime: number = 5000) {
    this.notificationQueueSubject.next(new Notification('error', summary, detail, lifetime));
  }

  addSuccessNotification(summary: string, detail: string, lifetime: number = 5000) {
    this.notificationQueueSubject.next(new Notification('success', summary, detail, lifetime));
  }

  addInfoNotification(summary: string, detail: string, lifetime: number = 5000) {
    this.notificationQueueSubject.next(new Notification('info', summary, detail, lifetime));
  }

  addWarnNotification(summary: string, detail: string, lifetime: number = 5000) {
    this.notificationQueueSubject.next(new Notification('warn', summary, detail, lifetime));
  }
}
