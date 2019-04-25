import { Roles } from 'src/app/shared/models/roles';


export class UserItem {
    userName: string;
    email: string;
    createdAt: string; // date?
    isActive: boolean; // or better 'active'-role?
    roles: Roles[];
    mandant: number = 0;
    lastActive: string;
    lastUsedBrowser: string;

    rolesDisplayText(): string {
        let result = this.roles.map(role => '' + role).join(', ');
        return `[${result}]`;
    }

    // constructor(userName: string, email: string, )
}
