import { Field } from './field';

export class EntityConfiguration {
    type: String;
    entity: String;
    displayName: String;
    rowsPerPage: Number;
    fields: Field[];
}
