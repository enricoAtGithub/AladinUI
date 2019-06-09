import { Field } from './field';

export class EntityConfiguration {
    name: String;
    entity: String;
    displayName: String;
    rowsPerPage: Number;
    fields: Field[];
}
