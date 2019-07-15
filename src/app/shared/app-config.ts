import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';

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

    constructor(private http: HttpClient) {}

    static uiInfo: UIInfo;

    static getBaseUrl(): string {
        return AppConfig.uiInfo.baseUrl;
    }

    static getUIInfo(): UIInfo {
        return AppConfig.uiInfo;
    }

    load() {
        const jsonFile = `assets/config/postbuildconfig.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response: UIInfo) => {
                AppConfig.uiInfo = response;

                if (!AppConfig.uiInfo.baseUrl) {
                    console.log('take Backend URL from environment');
                    AppConfig.uiInfo.baseUrl = environment.baseUrl;
                } else {
                    console.log('take Backend URL from postbuildConfig');
                }

                resolve();
            }).catch((response: any) => {
               reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }

    serverInfo(myFunc) {
        return this.http.get<ServerInfo>(AppConfig.getBaseUrl() + '/admin/info').subscribe(myFunc);
    }

}
