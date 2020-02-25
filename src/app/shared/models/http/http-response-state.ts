/**
 * Abstraction for a http response to use for requests without response-body.
 *
 * Intended to encapsulate error handling of http responses within the service and
 * unify / simplify the return value of the service method.
 *
 * @export
 * @interface HttpResponseState
 */
export interface HttpResponseState {
    success: boolean;
    errMsg?: string;
}
