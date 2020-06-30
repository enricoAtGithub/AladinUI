export class BasicFieldConfig {
    field: string; // name of the field
    header: string; // displayName
    mandatory = false;
    defaultValue: string; // if not editable, then it might still get a value during creation
    type: string; // String, integer, boolean, Date, Icon, Color, Currency, <DTOType>
    defaultCatalogue: string; // if entitiy field is of type CatalogueEntry, then this field holds the name of the default catalogue to use
    editable: boolean;
}

export class Field extends BasicFieldConfig {
    visible: boolean;
    sortable: boolean;
    filterType: string;
    width: string;
    options: Option[];
    formula: string;

    public static isPrimitiveType(type: string) {
        return type === 'String' || type === 'int' || type === 'boolean' || type === 'Date' || type === 'Currency';
    }
}

class Option {
    label: string;
    value: any;
}
