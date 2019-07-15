export class Field {
    field: String;
    formula: any;
    visible: boolean;
    editable: boolean;
    mandatory: boolean;
    defaultValue: String;
    type: String;
    sortable: boolean;
    filterType: String;
    width: String;
    options: Option[];
    header: String;
}

class Option {
    label: String;
    value: String;
}
