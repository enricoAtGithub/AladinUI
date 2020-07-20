export class NavigationTarget {

    private readonly _url: string;
    
    public get url(): string {
        return this._url;
    }

    constructor(url: string) {
        this._url = url;
    }
}
