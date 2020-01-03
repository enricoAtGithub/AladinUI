import { Injectable } from '@angular/core';
import { UIInfo } from '../app-config';


/**
 * This service will be an abstraction for the access of localstorage, sessionstorage and indexDB (maybe even cookie)
 *
 */
@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  private readonly UIINFO_KEY = 'uiInfo';

  constructor() { }

  hasUIInfo = (): boolean => !!localStorage.getItem(this.UIINFO_KEY);

  getUIInfo = (): UIInfo|null => <UIInfo>JSON.parse(localStorage.getItem(this.UIINFO_KEY));

  saveUIInfo = (uiInfo: UIInfo) => localStorage.setItem(this.UIINFO_KEY, JSON.stringify(uiInfo));
}
