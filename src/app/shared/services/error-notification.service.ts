import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ErrorMessage } from '../models/error-message';

@Injectable({
  providedIn: 'root'
})
export class ErrorNotificationService {
  public errorQueue$: Observable<ErrorMessage>;
  private errorQueueSubject: Subject<ErrorMessage>;

  public successQueue$: Observable<ErrorMessage>;
  private successQueueSubject: Subject<ErrorMessage>;

  constructor() {
    this.errorQueueSubject = new Subject();
    this.errorQueue$ = this.errorQueueSubject.asObservable();
    this.successQueueSubject = new Subject();
    this.successQueue$ = this.successQueueSubject.asObservable();
  }

  addErrorNotification(errorMessage: ErrorMessage) {
    this.errorQueueSubject.next(errorMessage);
  }

  addSuccessNotification(successMessage: ErrorMessage) {
    this.successQueueSubject.next(successMessage);
  }
}
