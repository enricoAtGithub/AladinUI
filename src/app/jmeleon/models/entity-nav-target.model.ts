import { NavigationTarget } from './navigation-target.model';

export class EntityNavTarget extends NavigationTarget {
    
    private readonly _selectedEntityId?: number;
    private readonly _selectedPage?: number;
    private readonly _selectedTabId?: number;

    public get selectedEntityId() {
        return this._selectedEntityId;
    }
    public get selectedPage() {
        return this._selectedPage;
    }
    public get selectedTabId() {
        return this._selectedTabId;
    }

    constructor(url: string, selectedEntityId?: number, selectedPage?: number, selectedTabId?: number) {
        super(url);
        this._selectedEntityId = selectedEntityId;
        this._selectedPage = selectedPage;
        this._selectedTabId = selectedTabId;
    }
}
