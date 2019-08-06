import { Field } from './field';

export class GroupConfiguration {
    type: String;
    holder: String;
    member: String;
    displayName: String;
    rowsPerPage: Number;
    memberFields: Field[];
}
