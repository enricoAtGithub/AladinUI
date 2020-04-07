import { Injectable } from '@angular/core';
import { UIInfo } from '../app-config';


/**
 * This service will be an abstraction for the access of localstorage, sessionstorage and indexDB (maybe even cookie)
 *
 * To decide:
 * Would it be cleaner to split this into topics (like uiInfo, permissions, etc) 
 *  and not have a big service that manages data all over the place?
 */
@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  private readonly UIINFO_KEY = 'uiInfo';
  private readonly MASTER_OF_DISASTER_KEY = 'masterOfDisasterRightId';

  // ****************** Settings ****************

  get hasMasterOfDisasterRightId(): boolean {
    return !!localStorage.getItem(this.MASTER_OF_DISASTER_KEY);
  }

  get masterOfDisasterRightId(): number {
    return +localStorage.getItem(this.MASTER_OF_DISASTER_KEY);
  }

  set masterOfDisasterRightId(id: number) {
    localStorage.setItem(this.MASTER_OF_DISASTER_KEY, id + '');
  }

  constructor() { }

  // ****************** UIInfo ******************
  
  hasUIInfo = (): boolean => !!localStorage.getItem(this.UIINFO_KEY);

  getUIInfo = (): UIInfo|null => <UIInfo>JSON.parse(localStorage.getItem(this.UIINFO_KEY));

  saveUIInfo = (uiInfo: UIInfo) => localStorage.setItem(this.UIINFO_KEY, JSON.stringify(uiInfo));
}
