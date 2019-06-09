export class Field {
    field: String;
    formula: any;
    type: String;
    visible: boolean;
    readOnly: boolean;
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