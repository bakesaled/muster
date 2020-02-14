import { OfxStatus } from './ofx-status';

export class OfxConnectionError extends Error {
  public friendlyMessage: string;
  public ofxStatus: OfxStatus;

  constructor(public errorCode: number, ...params) {
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OfxConnectionError);
    }

    switch (errorCode) {
      case 301:
        this.friendlyMessage = 'Moved Permanently. Check url.';
        this.ofxStatus = OfxStatus.Error;
        break;
      case 302:
        this.friendlyMessage = 'Temporarily unable to connect.';
        this.ofxStatus = OfxStatus.ServerDown;
        break;
      case 400:
        this.friendlyMessage = 'Bad Request';
        this.ofxStatus = OfxStatus.Error;
        break;
      case 401:
        this.friendlyMessage = 'Unauthorized.  Check login info.';
        this.ofxStatus = OfxStatus.Error;
        break;
      case 403:
        this.friendlyMessage = 'Forbidden';
        this.ofxStatus = OfxStatus.Error;
        break;
      case 408:
        this.friendlyMessage = 'Request Timeout';
        this.ofxStatus = OfxStatus.Error;
        break;
      default:
        this.friendlyMessage = 'Connection failure';
        this.ofxStatus = OfxStatus.Error;
    }

    Object.setPrototypeOf(this, OfxConnectionError.prototype);
  }
}
