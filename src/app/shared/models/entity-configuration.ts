import { Field } from './field';

export class EntityConfiguration {
    type: String;
    groups: String[];
    displayName: String;
    rowsPerPage: Number;
    fields: Field[];
}
