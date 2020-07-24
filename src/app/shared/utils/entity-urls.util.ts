import TokenUtils from './token.utils';

export default class EntityUrlsUtils {

    static getBaseUrlForEntityType(entityType: string): string {

        switch (entityType) {
            case 'Product': return '/masterdata/products';
            case 'Account': return '/masterdata/accounts';
            case 'Quotation': return '/sales/quotations';
            case 'Order': return '/sales/orders';
            case 'Resource': return '/resource-management/resources';
            case 'User': return '/administration/useralt-management';
            case 'Role': return '/administration/role-management';
            case 'Permission': return '/administration/permission-management';
            default: return `/dto-entities`;
        }
    }

    static generateUrlForEntityType(entityType: string, id: number, addToken: boolean = true): string {

        const baseUrl = EntityUrlsUtils.getBaseUrlForEntityType(entityType);

        const idUrl = `${baseUrl}?id=${id}`;

        const tokenUrl = addToken ? TokenUtils.addTokenToUrl(idUrl) : idUrl;

        if (baseUrl !== '/dto_entities') {
            return tokenUrl;
        }

        const entityUrl = `${tokenUrl}&type=${entityType}`;

        return entityUrl;
    }
}
