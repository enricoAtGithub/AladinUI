export class Field {
    field: string;
    formula: any;
    visible: boolean;
    editable: boolean;
    mandatory: boolean;
    defaultValue: string;
    type: string;
    defaultCatalogue: string;
    sortable: boolean;
    filterType: string;
    width: string;
    options: Option[];
    header: string;

    public static isPrimitiveType(type: string) {
        return type === 'String' || type === 'integer' || type === 'boolean' || type === 'Date';
    }
}

class Option {
    label: string;
    value: string;
}
