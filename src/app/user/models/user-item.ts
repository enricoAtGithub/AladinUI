import { Roles } from 'src/app/shared/models/roles';


export class UserItem {
    email: string;
    createdAt: string; // date?
    isActive: boolean; // or better 'active'-role?
    roles: Roles[];
}
