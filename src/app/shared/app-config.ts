import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
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
        return AppConfig.uiInfo.baseUrl;
    }

    load() {
        console.log('[AppConfig-load] start');

        const jsonFile = `assets/config/postbuildconfig.json`;
        // this.http.get('../../assets/config/postbuildconfig.json').subscribe(json => {
        this.http.get(jsonFile).subscribe(json => {
            const uiInfo = json as UIInfo;
            if (!uiInfo.baseUrl) {
                console.log('taking Backend URL from environment');
                uiInfo.baseUrl = environment.baseUrl;
            } else {
                console.log('taking Backend URL from postbuildConfig');
            }
            AppConfig.uiInfo = uiInfo;
            AppConfig.uiInfoSubject.next(uiInfo);
        });
    }

    loadServerInfo() {
        AppConfig.uiInfo$.subscribe(uiInfo => {
            this.http.get<ServerInfo>(uiInfo.baseUrl + '/admin/info')
                    .subscribe(serverInfo => AppConfig.serverInfoSubject.next(serverInfo));
        });
        // this.http.get<ServerInfo>(AppConfig.getBaseUrl() + '/admin/info')
        //             .subscribe(serverInfo => AppConfig.serverInfoSubject.next(serverInfo));
    }




}
