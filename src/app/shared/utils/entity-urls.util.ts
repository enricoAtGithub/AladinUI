import TokenUtils from './token.utils';

const EntityTypeUrlDict = {
    Product: '/masterdata/products',
    Account: '/masterdata/accounts',
    Quotation: '/sales/quotations',
    Order: '/sales/orders',
    Resource: '/resource-management/resources',
    User: '/administration/useralt-management',
    Role: '/administration/role-management',
    Permission: '/administration/permission-management',
};

export default class EntityUrlsUtils {

    static getBaseUrlForEntityType(entityType: string): string {

        // switch (entityType) {
        //     case 'Product': return '/masterdata/products';
        //     case 'Account': return '/masterdata/accounts';
        //     case 'Quotation': return '/sales/quotations';
        //     case 'Order': return '/sales/orders';
        //     case 'Resource': return '/resource-management/resources';
        //     case 'User': return '/administration/useralt-management';
        //     case 'Role': return '/administration/role-management';
        //     case 'Permission': return '/administration/permission-management';
        //     default: return `/dto-entities`;
        // }
        if (Object.keys(EntityTypeUrlDict).some(key => key === entityType)) {
            return EntityTypeUrlDict[entityType];
        }
        return `/dto-entities`;
    }

    static entityUrlNeedsQueryParamType = (entityType: string): boolean =>
        !Object.keys(EntityTypeUrlDict).some(key => key === entityType)

    // static generateUrlForEntityType(entityType: string, id: number, addToken: boolean = true): string {

    //     const baseUrl = EntityUrlsUtils.getBaseUrlForEntityType(entityType);

    //     const idUrl = `${baseUrl}?id=${id}`;

    //     const tokenUrl = addToken ? TokenUtils.addTokenToUrl(idUrl) : idUrl;

    //     // if (baseUrl !== '/dto_entities') {
    //     if (!EntityUrlsUtils.entityUrlNeedsQueryParamType(entityType)) {
    //         return tokenUrl;
    //     }

    //     const entityUrl = `${tokenUrl}&type=${entityType}`;

    //     return entityUrl;
    // }

    public static generateUrlForEntityType = (entityType: string): string[] => [EntityUrlsUtils.getBaseUrlForEntityType(entityType)];

    // for router link parameter: query params
    public static generateQueryParamsForEntityType(entityType: string, id: number, addToken: boolean = true): Object {
        const result = {};

        result['id'] = id;


        if (EntityUrlsUtils.entityUrlNeedsQueryParamType(entityType)) {
            result['type'] = entityType;
        }

        if (addToken) {
            result['token'] = TokenUtils.generateToken();
        }

        return result;
    }
}
