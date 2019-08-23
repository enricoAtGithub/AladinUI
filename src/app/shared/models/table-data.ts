export class TableData {
    tableName: string;
    configName: string;
    showHeadline: boolean;
    showHeader: boolean;
    showCrudButtons: boolean;
    scrollable: boolean;
    pagination: boolean;
    explicitUrl: string;
    scrollHeight: string;

    constructor(tableName: string, configName: string, showHeadline: boolean = true, showHeader: boolean = true,
        showCrudButtons: boolean = true, scrollable: boolean = false, pagination: boolean = true, explicitUrl?: string,
        scrollHeight?: string) {
            this.tableName = tableName;
            this. configName = configName;
            this.explicitUrl = explicitUrl;
            this.showHeadline = showHeadline;
            this.showHeader = showHeader;
            this.showCrudButtons = showCrudButtons;
            this.scrollable = scrollable;
            this.scrollHeight = scrollHeight;
            this.pagination = pagination;
    }
}
