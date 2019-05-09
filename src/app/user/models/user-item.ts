import { Role, BaseRoles } from 'src/app/shared/models/role';


export class UserItem {
    
    userName: string;
    email: string;
    createdAt: string; // date?
    isActive: boolean; // or better 'active'-role?
    roles: Role[];
    mandant = 0;
    lastActive: string;
    lastUsedBrowser: string;

    rolesDisplayText(): string {
        const result = this.roles.map(role => role.name).join(', ');
        return `[${result}]`;
    }

    hasRole(role: BaseRoles | string): boolean {
        let roleName: string;
        if (typeof role === 'string') {
            roleName = role;
        } else {
            roleName = role + '';
        }
        // return this.roles.findIndex(roleItem => roleItem.name === roleName) >= 0;
        const result = this.roles.findIndex(roleItem => roleItem.name === roleName) >= 0;
        console.log('result of role check for user: ', this.email);
        console.log('check for role: ', role);
        console.log('result: ', result);
        console.log(`(${this.rolesDisplayText()})`);
        return result;
    }

    // constructor(userName: string, email: string, )
}
