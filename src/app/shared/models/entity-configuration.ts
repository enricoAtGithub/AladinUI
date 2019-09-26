import { Field } from './field';

export class EntityConfiguration {
    type: string;
    groups: string[];
    components: string[];
    displayName: string;
    rowsPerPage: number;
    onAttachPost: {
        condition: string;
        action: string;
    };
    fields: Field[];
}
