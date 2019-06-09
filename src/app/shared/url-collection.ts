import { environment } from 'src/environments/environment';

export class UrlCollection {
    static readonly BASE_URL = environment.baseUrl;
    static readonly USER_API_BASE_PATH = UrlCollection.BASE_URL + '/user';
    static readonly ENTITY_API_BASE_PATH = UrlCollection.BASE_URL + '/entities';

    static UserManagement = class {

        static readonly CREATE = UrlCollection.USER_API_BASE_PATH + '/create';
        static readonly ALL = UrlCollection.USER_API_BASE_PATH + '/all';
        static readonly GET = UrlCollection.USER_API_BASE_PATH + '/get';
        static readonly UPDATE = UrlCollection.USER_API_BASE_PATH + '/update';
        static readonly DELETE = UrlCollection.USER_API_BASE_PATH + '/delete';
        static readonly LOGIN = UrlCollection.USER_API_BASE_PATH + '/login';
        static readonly LOGOUT = UrlCollection.USER_API_BASE_PATH + '/logout';
        static readonly CHANGE_PASSWD = UrlCollection.USER_API_BASE_PATH + '/changepwd';

        static buildGetUrl(userName: string) {
            return UrlCollection.UserManagement.GET + '/' + userName;
        }
    };

    static Entities = class {

        static readonly CONFIGS = UrlCollection.ENTITY_API_BASE_PATH + '/configurations';
        static readonly FILTER = UrlCollection.ENTITY_API_BASE_PATH + '/filter';

    };
}


