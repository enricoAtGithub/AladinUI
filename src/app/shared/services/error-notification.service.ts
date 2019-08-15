import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ErrorMessage } from '../models/error-message';

@Injectable({
  providedIn: 'root'
})
export class ErrorNotificationService {
  public errorQueue$: Observable<ErrorMessage>;
  private errorQueueSubject: Subject<ErrorMessage>;

  constructor() {
    this.errorQueueSubject = new Subject();
    this.errorQueue$ = this.errorQueueSubject.asObservable();
  }

  addErrorNotification(errorMessage: ErrorMessage) {
    this.errorQueueSubject.next(errorMessage);
  }
}
