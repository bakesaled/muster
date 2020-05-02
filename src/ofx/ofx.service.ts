import { OfxOptions } from './ofx-options';
import * as uuid from 'uuid';

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

  public static buildStatementRequest(
    options: OfxOptions,
    debug: boolean = false
  ) {
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
    if (debug) {
      console.debug('OFX-RequestString:', reqStr);
    }
    return reqStr;
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
