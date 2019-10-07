import { Subject } from "rxjs";

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

    triggerRefresh: Subject<unknown>;

    constructor(tableName: string, configName: string, showHeadline: boolean = true, showHeader: boolean = true,
        showCrudButtons: boolean = true, scrollable: boolean = false, pagination: boolean = true, explicitUrl?: string,
        scrollHeight?: string) {
            this.tableName = tableName;
            this.configName = configName;
            this.explicitUrl = explicitUrl;
            this.showHeadline = showHeadline;
            this.showHeader = showHeader;
            this.showCrudButtons = showCrudButtons;
            this.pagination = pagination;
            this.scrollable = scrollable;
            this.scrollHeight = scrollHeight;

            this.triggerRefresh = new Subject();
    }
}
