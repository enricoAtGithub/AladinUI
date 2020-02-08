import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpResponseState } from '../models/http/http-response-state';
import { HttpResult } from '../models/http/http-result';

@Injectable({
  providedIn: 'root'
})
export class ServiceHelperService {

  constructor() { }

  createErrorResponse(errMsg: string, err: HttpErrorResponse): HttpResponseState {
    console.log(errMsg, err);
    const result: HttpResponseState = {
      success: false,
      errMsg: `${errMsg}: ${err.error.message}`
    };
    return result;
  }

  createErrorResponseWithContent<T>(errMsg: string, err: HttpErrorResponse): HttpResult<T> {
    console.log(errMsg, err);
    const httpResult: HttpResult<T> = {
      success: false,
      errMsg: `${errMsg}: ${err.error.message}`
    };
    return httpResult;
  }

  createSuccessResponse(): HttpResponseState {
    const result: HttpResponseState = {
      success: true
    };
    return result;
  }

  createSuccessResponseWithContent<T>(response: T): HttpResult<T> {
    const httpResult: HttpResult<T> = {
      success: true,
      result: response
    };
    return httpResult;
  }
}
