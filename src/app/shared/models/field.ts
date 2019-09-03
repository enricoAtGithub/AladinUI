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
}

class Option {
    label: string;
    value: string;
}
