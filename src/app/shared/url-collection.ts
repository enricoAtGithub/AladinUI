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
        static CREATE(): string { return UrlCollection.ENTITY_API_BASE_PATH() + '/create'; }
        static UPDATE(): string { return UrlCollection.ENTITY_API_BASE_PATH() + '/update'; }
        static DELETE(): string { return UrlCollection.ENTITY_API_BASE_PATH() + '/delete'; }
        static CONFIGS(): string { return UrlCollection.ENTITY_API_BASE_PATH() + '/configurations'; }
        static FILTER(): string { return UrlCollection.ENTITY_API_BASE_PATH() + '/filter'; }

    };

    static Groups = class {
        static ADDMEMBER(): string { return UrlCollection.GROUPS_API_BASE_PATH() + '/addmember'; }
        static REMOVEMEMBER(): string { return UrlCollection.GROUPS_API_BASE_PATH() + '/removemember'; }
        static CONFIGS(): string { return UrlCollection.GROUPS_API_BASE_PATH() + '/configurations'; }
        static MEMBERS(): string { return UrlCollection.GROUPS_API_BASE_PATH() + '/members'; }

    };

    static Catalogues = class {
        static CREATE(): string { return UrlCollection.CATALOGUES_API_BASE_PATH() + '/create'; }
        static GET(): string { return UrlCollection.CATALOGUES_API_BASE_PATH() + '/get'; }
        static ALL(): string { return UrlCollection.CATALOGUES_API_BASE_PATH() + '/all'; }
        static DELETE(): string { return UrlCollection.CATALOGUES_API_BASE_PATH() + '/delete'; }
        static ADDENTRY(): string { return UrlCollection.CATALOGUES_API_BASE_PATH() + '/addEntry'; }
        static REMOVEENTRY(): string { return UrlCollection.CATALOGUES_API_BASE_PATH() + '/removeEntry'; }

    };

    static ADMIN_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/admin'; }
    static USER_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/user'; }
    static ENTITY_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/entities'; }
    static GROUPS_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/groups'; }
    static CATALOGUES_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/catalogue'; }
}


