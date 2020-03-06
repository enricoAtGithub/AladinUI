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
        static CONFIG_FILE = (configName: string) => UrlCollection.ENTITY_API_BASE_PATH() + '/configuration/file/' + configName;

    };

    static Groups = class {
        static ADDMEMBER(): string { return UrlCollection.GROUPS_API_BASE_PATH() + '/addmember'; }
        static REMOVEMEMBER(): string { return UrlCollection.GROUPS_API_BASE_PATH() + '/removemember'; }
        static CONFIGS(): string { return UrlCollection.GROUPS_API_BASE_PATH() + '/configurations'; }
        static MEMBERS(): string { return UrlCollection.GROUPS_API_BASE_PATH() + '/members'; }
    };

    static Catalogues = class {
        static CREATE(): string { return UrlCollection.CATALOGUE_API_BASE_PATH() + '/create'; }
        static GET(): string { return UrlCollection.CATALOGUE_API_BASE_PATH() + '/get'; }
        static ALL(): string { return UrlCollection.CATALOGUE_API_BASE_PATH() + '/all'; }
        static DELETE(): string { return UrlCollection.CATALOGUE_API_BASE_PATH() + '/delete'; }
        static ADDENTRY(): string { return UrlCollection.CATALOGUE_API_BASE_PATH() + '/addEntry'; }
        static REMOVEENTRY(): string { return UrlCollection.CATALOGUE_API_BASE_PATH() + '/removeEntry'; }

    };

    static Attachments = class {
        static attach = (): string => UrlCollection.basePathAttachment() + '/attach';
        static all = (): string => UrlCollection.basePathAttachment() + '/all';
    };

    static Files = class {
        static generateDownloadUrl = (id: number) => UrlCollection.FILE_API_BASE_PATH() + '/download/' + id;
        static generateUploadUrl = () => UrlCollection.FILE_API_BASE_PATH() + '/upload/';
    };

    static EntityAttachments = class {
        static ENTRIES = (attachmentType: string, entityType: string, id: number) => UrlCollection.ENTITY_ATTACHMENT_API_BASE_PATH(attachmentType) + '/entries/' + entityType + '/' + id;
        static REMOVE = (attachmentType: string) => UrlCollection.ENTITY_ATTACHMENT_API_BASE_PATH(attachmentType) + '/remove';
        static UPDATE = (attachmentType: string) => UrlCollection.ENTITY_ATTACHMENT_API_BASE_PATH(attachmentType) + '/update';
        static ADD = (attachmentType: string) => UrlCollection.ENTITY_ATTACHMENT_API_BASE_PATH(attachmentType) + '/add';
    };

    static ADMIN_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/admin'; }
    static USER_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/user'; }
    static ENTITY_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/entities'; }
    static CATALOGUE_API_BASE_PATH(): string {return AppConfig.getBaseUrl() + '/catalogue'; }
    static FILE_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/file'; }
    static GROUPS_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/groups'; }
    static ENTITY_ATTACHMENT_API_BASE_PATH(attachmentType: string): string { return AppConfig.getBaseUrl() + '/' + attachmentType; }
    static API_BASE_PATH(): string { return AppConfig.getBaseUrl(); }

    static basePathAttachment = (): string => AppConfig.getBaseUrl() + '/attachment';
}


