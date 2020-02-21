import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import PostBuildConfig from '../../assets/config/postbuildconfig.json';

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

    constructor(private http: HttpClient) {
        this.load();
    }

    static uiInfo: UIInfo;

    static getBaseUrl(): string {
        return AppConfig.uiInfo.baseUrl;
    }

    static getUIInfo(): UIInfo {
        return AppConfig.uiInfo;
    }

    load() {
        // AppConfig.uiInfo = PostBuildConfig as UIInfo;
        // if (!AppConfig.uiInfo.baseUrl) {
        //     console.log('take Backend URL from environment');
        //     AppConfig.uiInfo.baseUrl = environment.baseUrl;
        // } else {
        //     console.log('take Backend URL from postbuildConfig');
        // }
        this.http.get('../../assets/config/postbuildconfig.json').subscribe(json => {
            AppConfig.uiInfo = json as UIInfo;
            if (!AppConfig.uiInfo.baseUrl) {
                console.log('taking Backend URL from environment');
                AppConfig.uiInfo.baseUrl = environment.baseUrl;
            } else {
                console.log('taking Backend URL from postbuildConfig');
            }
        });
    }

    serverInfo(myFunc) {
        return this.http.get<ServerInfo>(AppConfig.getBaseUrl() + '/admin/info').subscribe(myFunc);
    }



}
