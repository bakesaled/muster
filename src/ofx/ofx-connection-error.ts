import { OfxConnectionStatus } from './ofx-response-status';

export class OfxConnectionError extends Error {
  public ofxConnectionStatus: OfxConnectionStatus;

  constructor(public errorCode: number, ...params) {
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OfxConnectionError);
    }

    this.ofxConnectionStatus = {
      code: errorCode,
      message: '?'
    };
    switch (errorCode) {
      case 301:
        this.ofxConnectionStatus.message = 'Moved Permanently. Check url.';
        break;
      case 302:
        this.ofxConnectionStatus.message = 'Temporarily unable to connect.';
        break;
      case 400:
        this.ofxConnectionStatus.message = 'Bad Request';
        break;
      case 401:
        this.ofxConnectionStatus.message = 'Unauthorized.  Check login info.';
        break;
      case 403:
        this.ofxConnectionStatus.message = 'Forbidden';
        break;
      case 408:
        this.ofxConnectionStatus.message = 'Request Timeout';
        break;
      default:
        this.ofxConnectionStatus.message =
          'Undefined connection failure:' + params[0];
    }

    Object.setPrototypeOf(this, OfxConnectionError.prototype);
  }
}
