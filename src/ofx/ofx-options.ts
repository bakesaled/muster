export interface OfxOptions {
  fid: string;
  fidOrg: string;
  url: string;
  bankId?: string;
  brokerId?: string;
  user: string;
  password: string;
  accId?: string;
  accType?: string;
  start?: string;
  end?: string;
  clientId?: string;
  appVer: string;
  ofxVer: string;
  ofxHeaderVer: string;
  app: string;
  'User-Agent': string;
  'Content-Type': string;
  Accept: string;
  Connection?: string;
  headers: string[];
}
