import { environment } from 'src/environments/environment';

export class UrlCollection {
    public static BASE_URL = environment.baseUrl;

    static UserManagement = class {
        public static readonly USER_API_BASE_PATH = UrlCollection.BASE_URL + '/user';

        public static readonly CREATE = UrlCollection.UserManagement.USER_API_BASE_PATH + '/create';
        public static readonly ALL = UrlCollection.UserManagement.USER_API_BASE_PATH + '/all';
        public static readonly GET = UrlCollection.UserManagement.USER_API_BASE_PATH + '/get';
        public static readonly UPDATE = UrlCollection.UserManagement.USER_API_BASE_PATH + '/update';
        public static readonly DELETE = UrlCollection.UserManagement.USER_API_BASE_PATH + '/delete';

        public static buildGetUrl(userName: string) {
            return UrlCollection.UserManagement.GET + '/' + userName;
        }
    };
}
