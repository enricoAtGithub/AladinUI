export class Catalogue {
    id: number;
    name: string;
    description: string;
    values: CatalogueEntry[];

    constructor() {
        this.values = [];
    }
}

export class CatalogueEntry {
    id: number;
    name: string;
    description: string;
}
