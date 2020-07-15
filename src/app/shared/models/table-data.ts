import { Subject, Observable } from 'rxjs';
import { EntityData } from './entity-data';

export class TableData {
    tableName: string;
    entityType: string;
    showHeadline = true;
    showHeader = true;
    showButtons = true;
    pagination = true;
    showAttachments = true;
    scrollable = false;
    inlineEdit = true;
    dataSource: Observable<EntityData>;
    scrollHeight: string;

    triggerRefresh: Subject<unknown>;

    constructor(tableName: string, entityType: string)  {
        this.triggerRefresh = new Subject();
        this.entityType = entityType;
        this.tableName = tableName;
    }

    setTableName(tableName: string) {
        this.tableName = tableName;
        return this;
    }

    setDataSource(dataSource: Observable<EntityData>) {
        this.dataSource = dataSource;
        return this;
    }

    setScrollHeight(scrollHeight: string) {
        this.scrollHeight = scrollHeight;
        return this;
    }

    setScrollable() {
        this.scrollable = true;
        return this;
    }

    hideHeadline() {
        this.showHeadline = false;
        return this;
    }

    hideHeader() {
        this.showHeader = false;
        return this;
    }

    hideButtons() {
        this.showButtons = false;
        return this;
    }

    hideAttachments() {
        this.showAttachments = false;
        return this;
    }

    disablePagination() {
        this.pagination = false;
        return this;
    }

    disableInlineEdit() {
        this.inlineEdit = false;
        return this;
    }
}
