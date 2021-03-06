import { Field } from './field';

export interface AttributeGroup {
    attributes: AttributeGroupEntry[];
    name: string;
    displayName: string;
    appearance: string;
}

export interface AttributeGroupEntry {
    name: string;
    type: string;
    dtoType: string;
}

export interface AttachmentCategory {
    attachmentCatHrid: string; // HRID of attachment category catalogue entry
    displayName: string;
}

export class EntityAttachment {
    type: string;
    name: string;
    displayName: string;
    appearance: string;
    showCollapsed: boolean;
    attributes: AttributeGroupEntry[];
    attachmentCategories: AttachmentCategory[];
}

export class EntityConfiguration {
    type: string;
    displayName: string;
    rowsPerPage: number;
    onAttachPost: {
        condition: string;
        action: string;
    };
    entityAttachments: EntityAttachment[];
    fields: Field[];
    minWidth: number;
    actions: Object;
    customCreation: {
        creationMode: string,
        creationAction: {
            action: string;
            condition: string;
        };
    };
}
