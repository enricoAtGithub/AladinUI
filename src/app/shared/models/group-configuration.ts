import { Field } from './field';

export class GroupConfiguration {
    type: string;
    holder: string;
    member: string;
    displayName: string;
    rowsPerPage: number;
    memberFields: Field[];
}
