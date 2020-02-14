import { OfxOptions } from './ofx-options';
import { UrlWithStringQuery } from 'url';
import { OfxBody } from './ofx-response';
import { OfxService } from './ofx.service';
import { OfxDateRange } from './ofx-date-range';
import * as Url from 'url';
import * as tls from 'tls';
import { OfxConnectionError } from './ofx-connection-error';

export class OfxRequestService {
  constructor(private options: OfxOptions) {}

  public async getAccounts(): Promise<OfxBody> {
    const ofxPayload = OfxService.buildAccountListRequest(this.options);
    const result = await this.sendRequest(this.options, ofxPayload);
    console.debug('sent', result);
    return await OfxService.parse(result);
  }

  public async getStatement(dateRange: OfxDateRange) {
    this.options.start = dateRange.start;
    this.options.end = dateRange.end;
    const ofxPayload = OfxService.buildStatementRequest(this.options);
    const result = await this.sendRequest(this.options, ofxPayload);
    return await OfxService.parse(result);
  }

  private convertBankingOptionsToHeaderString(
    options: OfxOptions,
    parsedUrl: UrlWithStringQuery,
    ofxPayload: string
  ) {
    let result = '';
    options.headers.forEach(function(header) {
      let value;
      if (options[header]) {
        value = options[header];
      } else if (header === 'Content-Length') {
        value = ofxPayload.length;
      } else if (header === 'Host') {
        value = parsedUrl.host;
      }
      result += header + ': ' + value + '\r\n';
    });

    return result;
  }

  private sendRequest(
    options: OfxOptions,
    ofxPayload: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      return this.buildSocket(options, ofxPayload, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
  private buildSocket(options: OfxOptions, ofxPayload: string, cb) {
    const parsedUrl = Url.parse(options.url);
    const tlsOptions = {
      port:
        parseInt(parsedUrl.port, 10) ||
        (parsedUrl.protocol === 'https:' ? 443 : 80),
      host: parsedUrl.hostname,
      rejectUnauthorized: true
    };

    if (parsedUrl.hostname === 'localhost') {
      tlsOptions.rejectUnauthorized = false;
    }

    const socket = tls.connect(tlsOptions, () => {
      let buffer = `POST ${parsedUrl.path} HTTP/1.1\r\n`;
      buffer += this.convertBankingOptionsToHeaderString(
        options,
        parsedUrl,
        ofxPayload
      );
      buffer += '\r\n';
      buffer += ofxPayload;
      console.debug(
        'sending request',
        tlsOptions.port,
        tlsOptions.host,
        buffer
      );
      socket.write(buffer);
    });

    let data = '';

    socket.on('data', chunk => {
      data += chunk;
    });

    socket.on('error', err => {
      cb(err);
    });

    socket.on('end', () => {
      let error: any = true;
      const httpHeaderMatcher = new RegExp(/HTTP\/\d\.\d (\d{3}) (.*)/);
      console.log('response', data);
      const matches = httpHeaderMatcher.exec(data);
      if (matches && matches.length > 2) {
        if (parseInt(matches[1], 10) === 200) {
          error = false;
        } else {
          error = new OfxConnectionError(
            parseInt(matches[1], 10),
            `${matches[1]}: ${matches[0]}`
          );
        }
      }
      cb(error, data);
    });
  }
}
