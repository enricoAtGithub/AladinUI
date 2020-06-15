import { Field } from './field';

export interface AttributeGroup {
    attributes: AttributeGroupEntries[];
    hrid: string;
    name: string;
}

export interface AttributeGroupEntries {
    name: string;
    type: string;
    dtoType: string;
}

export class EntityConfiguration {
    type: string;
    groups: string[];
    components: string[];
    subtypes: string[];
    displayName: string;
    rowsPerPage: number;
    onAttachPost: {
        condition: string;
        action: string;
    };
    fields: Field[];
    attributeGroups: AttributeGroup[];
    scrollable: boolean;
    minWidth: number;
}
