import { HttpResponseState } from './http-response-state';


/**
 * Extends the HttpResponseState interface to hold the result (body data of Type T) of a successful request.
 *
 * @export
 * @interface HttpResult
 * @extends {HttpResponseState}
 * @template T - Type of the expected result
 */
export interface HttpResult<T> extends HttpResponseState {
    result?: T;
}
