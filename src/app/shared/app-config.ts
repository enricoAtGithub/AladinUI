import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import PostBuildConfig from '../../assets/config/postbuildconfig.json';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

export class ServerInfo {
    host: string;
    version: string;
    buildtime: string;
    pid: string;
    upSince: string;
}

export class UIInfo {
    baseUrl: string;
    git_branch: string;
    git_sha: string;
    version: string;
    build_no: string;
}


@Injectable()
export class AppConfig {

    private static uiInfoSubject = new ReplaySubject<UIInfo>(1);
    static uiInfo$ = AppConfig.uiInfoSubject.asObservable();
    private static serverInfoSubject = new ReplaySubject<ServerInfo>(1);
    static serverInfo$ = AppConfig.serverInfoSubject.asObservable();
    static uiInfo: UIInfo;

    constructor(private http: HttpClient) {
        this.load();

    }

    static getBaseUrl(): string {
        // console.log('[AppConfig-serverInfo(myFunc)] reading base url. uiInfo: ', AppConfig.uiInfo);
        return AppConfig.uiInfo.baseUrl;
    }

    static getUIInfo(): UIInfo {
        return AppConfig.uiInfo;
    }

    load() {
        console.log('[AppConfig-load] start');
        this.http.get('../../assets/config/postbuildconfig.json').subscribe(json => {
            // console.log('[AppConfig-load] subscription activated');
            const uiInfo = json as UIInfo;
            if (!uiInfo.baseUrl) {
                console.log('taking Backend URL from environment');
                uiInfo.baseUrl = environment.baseUrl;
            } else {
                console.log('taking Backend URL from postbuildConfig');
            }
            // console.log('[AppConfig-load] firing first uiInfoSubject message');
            AppConfig.uiInfo = uiInfo;
            AppConfig.uiInfoSubject.next(uiInfo);
        });
    }

    // serverInfo(myFunc) {
    //     console.log('[AppConfig-serverInfo(myFunc)] reading server info.');
    //     return this.http.get<ServerInfo>(AppConfig.getBaseUrl() + '/admin/info').subscribe(myFunc);
    // }

    loadServerInfo() {
        this.http.get<ServerInfo>(AppConfig.getBaseUrl() + '/admin/info')
                    .subscribe(serverInfo => AppConfig.serverInfoSubject.next(serverInfo));
    }




}
