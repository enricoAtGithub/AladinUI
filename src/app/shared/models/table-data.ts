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
    showAttachments: boolean;

    triggerRefresh: Subject<unknown>;

    constructor(tableName: string, configName: string, showHeadline: boolean = true, showHeader: boolean = true,
        showCrudButtons: boolean = true, scrollable: boolean = false, pagination: boolean = true, explicitUrl?: string,
        scrollHeight?: string, showAttachments: boolean = true) {
            this.tableName = tableName;
            this.configName = configName;
            this.explicitUrl = explicitUrl;
            this.showHeadline = showHeadline;
            this.showHeader = showHeader;
            this.showCrudButtons = showCrudButtons;
            this.pagination = pagination;
            this.scrollable = scrollable;
            this.scrollHeight = scrollHeight;
            this.showAttachments = showAttachments;

            this.triggerRefresh = new Subject();
    }
}
