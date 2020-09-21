import { AppConfig } from './app-config';

export class UrlCollection {

    static Admin = class {

        static INFO(): string { return UrlCollection.ADMIN_API_BASE_PATH() + '/info'; }
    };

    static UserManagement = class {

        static Actions = class {
            static ADD(): string { return UrlCollection.USER_ACTIONS_BASE_PATH() + '/add'; }
        };

        static Right = class {
            static ALL_ACTIONS = (rightId: number) => `${UrlCollection.UserManagement.RIGHT()}/${rightId}/allActions`;
            static ADD_ACTION = (rightId: number) => `${UrlCollection.UserManagement.RIGHT()}/${rightId}/addAction`;
            static REMOVE_ACTION = (rightId: number) => `${UrlCollection.UserManagement.RIGHT()}/${rightId}/removeAction`;
        };

        static CREATE(): string { return UrlCollection.USER_API_BASE_PATH() + '/create'; }
        static ALL(): string { return UrlCollection.USER_API_BASE_PATH() + '/all'; }
        static GET(): string { return UrlCollection.USER_API_BASE_PATH() + '/get'; }
        static UPDATE(): string { return UrlCollection.USER_API_BASE_PATH() + '/update'; }
        static DELETE(): string { return UrlCollection.USER_API_BASE_PATH() + '/delete'; }
        static LOGIN(): string { return UrlCollection.USER_API_BASE_PATH() + '/login'; }
        static LOGOUT(): string { return UrlCollection.USER_API_BASE_PATH() + '/logout'; }
        static CHANGE_PASSWD(): string { return UrlCollection.USER_API_BASE_PATH() + '/changepwd'; }

        static RIGHT(): string { return UrlCollection.USER_API_BASE_PATH() + '/right'; }
        static VALIDATE_TOKEN(): string {return UrlCollection.USER_API_BASE_PATH() + '/validateToken'; }

        static buildGetUrl(userName: string) {
            return UrlCollection.UserManagement.GET() + '/' + userName;
        }

    };

    static Scheduler = class {
        static SCHEDULER_ORDERS = () => UrlCollection.SCHEDULER_API_BASE_PATH() + '/schedulerOrders';
        private static SCHEDULER_ORDER = () => UrlCollection.SCHEDULER_API_BASE_PATH() + '/schedulerOrder';
        static SCHEDULER_RESOURCES = (schedulerEventId: number) => UrlCollection.Scheduler.SCHEDULER_ORDER() + '/' + schedulerEventId + '/resources';
        static UPDATE_ORDER_INTERVAL = (schedulerEventId: number) => UrlCollection.Scheduler.SCHEDULER_ORDER() + '/' + schedulerEventId + '/updateOrderInterval';
        static ASSIGN_RESOURCE = (schedulerEventId: number, resourceId: number) => UrlCollection.Scheduler.SCHEDULER_ORDER() + '/' + schedulerEventId + '/resource/' + resourceId + '/assign';
        static REMOVE_RESOURCE = (schedulerEventId: number, resourceId: number) => UrlCollection.Scheduler.SCHEDULER_ORDER() + '/' + schedulerEventId + '/resource/' + resourceId + '/remove';
    };

    static Availability = class {
        static RESOURCEAVAILABILITIES = () => UrlCollection.SCHEDULER_API_BASE_PATH() + '/resourceAvailabilities';
        private static RESOURCEAVAILABILITY = () => UrlCollection.SCHEDULER_API_BASE_PATH() + '/resourceAvailability';
        static UPDATE_AVAILABILITY_INTERVAL = (availabilityId: number) => UrlCollection.Availability.RESOURCEAVAILABILITY() + '/' + availabilityId + '/updateInterval';
    };

    static Entities = class {
        static CREATE(): string { return UrlCollection.ENTITY_API_BASE_PATH() + '/create'; }
        static UPDATE(): string { return UrlCollection.ENTITY_API_BASE_PATH() + '/update'; }
        static DELETE(): string { return UrlCollection.ENTITY_API_BASE_PATH() + '/delete'; }
        static CONFIGS(): string { return UrlCollection.ENTITY_API_BASE_PATH() + '/configurations'; }
        static GET = (type: string, id: number) => UrlCollection.ENTITY_API_BASE_PATH() + '/get/' + type + '/' + id;
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
        static UPDATE(): string { return UrlCollection.FILE_API_BASE_PATH() + '/update/'; }
    };

    static EntityAttachments = class {
        static ENTRIES = (attachmentType: string, entityType: string, id: number) =>
            UrlCollection.ENTITY_ATTACHMENT_API_BASE_PATH(attachmentType) + '/entries/' + entityType + '/' + id
        static REMOVE = (attachmentType: string) => UrlCollection.ENTITY_ATTACHMENT_API_BASE_PATH(attachmentType) + '/remove';
        static UPDATE = (attachmentType: string) => UrlCollection.ENTITY_ATTACHMENT_API_BASE_PATH(attachmentType) + '/update';
        static ADD = (attachmentType: string) => UrlCollection.ENTITY_ATTACHMENT_API_BASE_PATH(attachmentType) + '/add';
    };

    static EntityAttributes = class {
        static ENTRIES = (entityType: string, id: number, attrGroup: string = 'null') =>
            UrlCollection.ENTITY_ATTRIBUTE_API_BASE_PATH() + '/entries/' + entityType + '/' + id + '/group/' + attrGroup
        static REMOVE(): string { return UrlCollection.ENTITY_ATTRIBUTE_API_BASE_PATH() + '/remove'; }
        static UPDATE(): string { return UrlCollection.ENTITY_ATTRIBUTE_API_BASE_PATH() + '/update'; }
        static ADD(): string { return UrlCollection.ENTITY_ATTRIBUTE_API_BASE_PATH() + '/add'; }
    };

    static Actions = class {
        static GETACTION(): string { return UrlCollection.SCRIPT_API_BASE_PATH() + '/getAction'; }
        static EXECUTE(): string { return UrlCollection.SCRIPT_API_BASE_PATH() + '/executeAction'; }
        static EXECUTESNIPPET(): string { return UrlCollection.SCRIPT_API_BASE_PATH() + '/execute'; }
    };

    static SCHEDULER_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/scheduler'; }
    static ADMIN_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/admin'; }
    static USER_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/user'; }
    static USER_ACTIONS_BASE_PATH(): string { return UrlCollection.USER_API_BASE_PATH() + '/actions'; }
    static USER_RIGHTS_BASE_PATH(): string { return UrlCollection.USER_API_BASE_PATH() + '/right'; }
    static ENTITY_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/entities'; }
    static CATALOGUE_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/catalogue'; }
    static FILE_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/file'; }
    static GROUPS_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/groups'; }
    static ENTITY_ATTACHMENT_API_BASE_PATH(attachmentType: string): string { return AppConfig.getBaseUrl() + '/' + attachmentType; }
    static ENTITY_ATTRIBUTE_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/attribute'; }
    static SCRIPT_API_BASE_PATH(): string { return AppConfig.getBaseUrl() + '/script'; }
    static API_BASE_PATH(): string { return AppConfig.getBaseUrl(); }

    static EVAL(): string { return AppConfig.getBaseUrl() + '/script/eval/'; }

    static basePathAttachment = (): string => AppConfig.getBaseUrl() + '/attachment';
}


