import { OfxOptions } from './ofx-options';
import * as uuid from 'uuid';
import { OfxBody } from './ofx-response';
import * as Xml2JsParser from 'xml2js';

export class OfxService {
  public static buildAccountListRequest(options: OfxOptions) {
    return (
      `${OfxService.getOfxHeaders(options)}<OFX>${OfxService.getSignOnMsg(
        options
      )}` +
      `<SIGNUPMSGSRQV1>` +
      `<ACCTINFOTRNRQ>` +
      `<TRNUID>${uuid.v1()}` +
      `<ACCTINFORQ>` +
      `<DTACCTUP>19900101` +
      `</ACCTINFORQ>` +
      `</ACCTINFOTRNRQ>` +
      `</SIGNUPMSGSRQV1>` +
      `</OFX>`
    );
  }

  public static buildStatementRequest(options: OfxOptions) {
    const type = (options.accType || '').toUpperCase();
    let reqStr =
      OfxService.getOfxHeaders(options) +
      '<OFX>' +
      OfxService.getSignOnMsg(options);

    switch (type) {
      case 'INVESTMENT':
        reqStr +=
          '<INVSTMTMSGSRQV1>' +
          '<INVSTMTTRNRQ>' +
          '<TRNUID>' +
          uuid.v1() +
          '<CLTCOOKIE>' +
          uuid.v1().substr(0, 5) +
          '<INVSTMTRQ>' +
          '<INVACCTFROM>' +
          '<BROKERID>' +
          options.brokerId +
          '<ACCTID>' +
          options.accId +
          '</INVACCTFROM>' +
          '<INCTRAN>' +
          '<DTSTART>' +
          options.start +
          (typeof options.end !== 'undefined' ? '<DTEND>' + options.end : '') +
          '<INCLUDE>Y</INCTRAN>' +
          '<INCOO>Y' +
          '<INCPOS>' +
          '<INCLUDE>Y' +
          '</INCPOS>' +
          '<INCBAL>Y' +
          '</INVSTMTRQ>' +
          '</INVSTMTTRNRQ>' +
          '</INVSTMTMSGSRQV1>';
        break;

      case 'CREDITCARD':
        reqStr +=
          '<CREDITCARDMSGSRQV1>' +
          '<CCSTMTTRNRQ>' +
          '<TRNUID>' +
          uuid.v1() +
          '<CLTCOOKIE>' +
          uuid.v1().substr(0, 5) +
          '<CCSTMTRQ>' +
          '<CCACCTFROM>' +
          '<ACCTID>' +
          options.accId +
          '</CCACCTFROM>' +
          '<INCTRAN>' +
          '<DTSTART>' +
          options.start +
          (typeof options.end !== 'undefined' ? '<DTEND>' + options.end : '') +
          '<INCLUDE>Y</INCTRAN>' +
          '</CCSTMTRQ>' +
          '</CCSTMTTRNRQ>' +
          '</CREDITCARDMSGSRQV1>';
        break;

      default:
        reqStr +=
          '<BANKMSGSRQV1>' +
          '<STMTTRNRQ>' +
          '<TRNUID>' +
          uuid.v1() +
          '<CLTCOOKIE>' +
          uuid.v1().substr(0, 5) +
          '<STMTRQ>' +
          '<BANKACCTFROM>' +
          '<BANKID>' +
          options.bankId +
          '<ACCTID>' +
          options.accId +
          '<ACCTTYPE>' +
          type +
          '</BANKACCTFROM>' +
          '<INCTRAN>' +
          '<DTSTART>' +
          options.start +
          (typeof options.end !== 'undefined' ? '<DTEND>' + options.end : '') +
          '<INCLUDE>Y</INCTRAN>' +
          '</STMTRQ>' +
          '</STMTTRNRQ>' +
          '</BANKMSGSRQV1>';
    }

    reqStr += '</OFX>';
    console.debug('OFX-RequestString:', reqStr);
    return reqStr;
  }

  public static parse(ofxString: string): Promise<OfxBody> {
    return new Promise((resolve, reject) => {
      const ofxResult = ofxString.split('<OFX>', 2);
      const ofxPart = `<OFX>${ofxResult[1]}`;

      // TODO: Check headers?
      // const headerPart = ofxResult[0].split(/\r|\n/);

      const xml = ofxPart
        // Replace ampersand
        .replace(/&/g, `&#038;`)
        .replace(/&amp;/g, `&#038;`)
        // Remove empty spaces and line breaks between tags
        .replace(/>\s+</g, '><')
        // Remove empty spaces and line breaks before tags content
        .replace(/\s+</g, '<')
        // Remove empty spaces and line breaks after tags content
        .replace(/>\s+/g, '>')
        // Remove dots in start-tags names and remove end-tags with dots
        .replace(
          /<([A-Z0-9_]*)+\.+([A-Z0-9_]*)>([^<]+)(<\/\1\.\2>)?/g,
          '<$1$2>$3'
        )
        // Add a new end-tags for the ofx elements
        .replace(/<(\w+?)>([^<]+)/g, '<$1>$2</<added>$1>')
        // Remove duplicate end-tags
        .replace(/<\/<added>(\w+?)>(<\/\1>)?/g, '</$1>');

      let json;
      const parser = new Xml2JsParser.Parser({ explicitArray: false });
      parser.parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        }
        json = result;
        resolve(json);
      });
    });
  }

  private static getOfxHeaders(options: OfxOptions) {
    return (
      `OFXHEADER:${options.ofxHeaderVer}\r\n` +
      `DATA:OFXSGML\r\n` +
      `VERSION:${options.ofxVer}\r\n` +
      `SECURITY:NONE\r\n` +
      `ENCODING:USASCII\r\n` +
      `CHARSET:1252\r\n` +
      `COMPRESSION:NONE\r\n` +
      `OLDFILEUID:NONE\r\n` +
      `NEWFILEUID:${uuid.v1()}\r\n` +
      `\r\n`
    );
  }

  private static getSignOnMsg(options: OfxOptions) {
    const dtClient = new Date()
      .toISOString()
      .substring(0, 20)
      .replace(/[^0-9]/g, '');

    return (
      `<SIGNONMSGSRQV1>` +
      `<SONRQ>` +
      `<DTCLIENT>` +
      dtClient +
      `<USERID>` +
      options.user +
      `<USERPASS>` +
      options.password +
      `<LANGUAGE>ENG` +
      `<FI>` +
      `<ORG>` +
      options.fidOrg +
      `<FID>` +
      options.fid +
      `</FI>` +
      `<APPID>` +
      options.app +
      `<APPVER>` +
      options.appVer +
      (typeof options.clientId !== `undefined`
        ? `<CLIENTUID>` + options.clientId
        : ``) +
      `</SONRQ>` +
      `</SIGNONMSGSRQV1>`
    );
  }
}
