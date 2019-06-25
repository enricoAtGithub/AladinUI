export interface HttpResult<T> {
    success: boolean;
    result?: T;
    errMsg?: string;
}
