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
    decimals: number;       // number of decimals for float type

    public static isPrimitiveType(type: string) {
        return type === 'String' || type === 'int' || type === 'boolean' || type === 'Date' || type === 'Currency' || type === 'float' || type === 'json' || type === 'python';
    }

    public static isKnownType(type: string) {
        return this.isPrimitiveType(type)  || type === 'dtoType' || type === 'CatalogueEntry' || type === 'Icon';
    }
}

class Option {
    label: string;
    value: any;
}
