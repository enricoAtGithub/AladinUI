import { Role, BaseRoles } from './role';
import { UserItem } from 'src/app/user/models/user-item';

export class User {
    public token: string;
    public user: UserItem;
    // public roles: Role[];
    public roles: string[];
    public loggedInSince: string;

    // rolesDisplayText(): string {
    //     const result = this.roles.map(role => role.name).join(', ');
    //     return `[${result}]`;
    // }

    // hasRole(role: BaseRoles | string): boolean {
    //     let roleName: string;
    //     if (typeof role === 'string') {
    //         roleName = role;
    //     } else {
    //         roleName = role + '';
    //     }
    //     // return this.roles.findIndex(roleItem => roleItem.name === roleName) >= 0;
    //     const result = this.roles.findIndex(roleItem => roleItem.name === roleName) >= 0;
    //     console.log('result of role check for user: ', this.user.loginName);
    //     console.log('check for role: ', role);
    //     console.log('result: ', result);
    //     console.log(`(${this.rolesDisplayText()})`);
    //     return result;
    // }

}
