import { AppConfig } from './app-config';

export class UrlCollection {

    static Admin = class {

        static INFO(): string { return UrlCollection.ADMIN_API_BASE_PATH() + '/info'; }
    };

    static UserManagement = class {

        static CREATE(): string {return UrlCollection.USER_API_BASE_PATH() + '/create'; }
        static ALL(): string { return UrlCollection.USER_API_BASE_PATH() + '/all'; }
        static GET(): string { return UrlCollection.USER_API_BASE_PATH() + '/get'; }
        static UPDATE(): string { return UrlCollection.USER_API_BASE_PATH() + '/update'; }
        static DELETE(): string { return UrlCollection.USER_API_BASE_PATH() + '/delete'; }
        static LOGIN(): string { return UrlCollection.USER_API_BASE_PATH() + '/login'; }
        static LOGOUT(): string { return UrlCollection.USER_API_BASE_PATH() + '/logout'; }
        static CHANGE_PASSWD(): string { return UrlCollection.USER_API_BASE_PATH() + '/changepwd'; }

        static buildGetUrl(userName: string) {
            return UrlCollection.UserManagement.GET() + '/' + userName;
        }
    };

    static Entities = class {

        static CONFIGS(): string { return UrlCollection.ENTITY_API_BASE_PATH() + '/configurations'; }
        static FILTER(): string { return UrlCollection.ENTITY_API_BASE_PATH() + '/filter'; }

    };

    static ADMIN_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/admin'; }
    static USER_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/user'; }
    static ENTITY_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/entities'; }
}


