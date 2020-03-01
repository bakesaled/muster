export interface OfxResponseStatus {
  signOnStatus: OfxStatus;

  /**
   * Enrollment Status
   */
  signUpStatus: OfxStatus;
  connectionStatus: OfxConnectionStatus;
  specificStatus: OfxStatus;
}

export interface OfxStatus {
  CODE: string;
  SEVERITY: string;
  MESSAGE: string;
}

export interface OfxConnectionStatus {
  code: number;
  message: string;
}
