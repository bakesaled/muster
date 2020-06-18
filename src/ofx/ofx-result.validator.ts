import { DOMParser } from 'xmldom';
import {
  OfxConnectionStatus,
  OfxResponseStatus,
  OfxStatus
} from './ofx-response-status';

export class OfxResultValidator {
  public static validate(
    res: string,
    connStatus: OfxConnectionStatus = { code: 200, message: 'OK' }
  ): OfxResponseStatus {
    if (connStatus.code !== 200) {
      return {
        connectionStatus: connStatus,
        signOnStatus: undefined,
        signUpStatus: undefined,
        specificStatus: undefined
      };
    }
    const cleanRes = OfxResultValidator.cleanXML(res);
    const parser = new DOMParser();
    const xmlDocument = parser.parseFromString(cleanRes, 'text/xml');
    const root = xmlDocument.documentElement;
    const signOnStatusNode = OfxResultValidator.getSignOnStatus(root);
    const signOnStatus = OfxResultValidator.convertStatusToJSON(
      signOnStatusNode
    );

    const signUpStatusNode = OfxResultValidator.getSignUpStatus(root);
    const signUpStatus = OfxResultValidator.convertStatusToJSON(
      signUpStatusNode
    );

    const bankStatusNode = OfxResultValidator.getBankStatus(root);
    const creditCardStatusNode = OfxResultValidator.getCreditCardStatus(root);
    const investmentStatusNode = OfxResultValidator.getInvestmentStatus(root);

    let specificStatus;
    if (bankStatusNode) {
      specificStatus = OfxResultValidator.convertStatusToJSON(bankStatusNode);
    } else if (creditCardStatusNode) {
      specificStatus = OfxResultValidator.convertStatusToJSON(
        creditCardStatusNode
      );
    } else if (investmentStatusNode) {
      specificStatus = OfxResultValidator.convertStatusToJSON(
        investmentStatusNode
      );
    }

    return {
      connectionStatus: connStatus,
      signOnStatus: signOnStatus,
      signUpStatus: signUpStatus,
      specificStatus: specificStatus
    };
  }

  private static getSignOnStatus(root: Element): Element {
    const signOnNode = root.getElementsByTagName('SIGNONMSGSRSV1');
    if (!signOnNode || !signOnNode.item(0)) {
      return null;
    }
    const sonRsNode = signOnNode.item(0).getElementsByTagName('SONRS');
    return sonRsNode.item(0);
  }

  private static getSignUpStatus(root: Element): Element {
    const signUpNode = root.getElementsByTagName('SIGNUPMSGSRSV1');
    if (!signUpNode || !signUpNode.item(0)) {
      return null;
    }
    const accountInfoRsNode = signUpNode
      .item(0)
      .getElementsByTagName('ACCTINFOTRNRS');
    return accountInfoRsNode.item(0);
  }

  private static getBankStatus(root: Element): Element {
    const bankNode = root.getElementsByTagName('BANKMSGSRSV1');
    if (!bankNode || !bankNode.item(0)) {
      return null;
    }
    const statementRsNode = bankNode.item(0).getElementsByTagName('STMTTRNRS');
    return statementRsNode.item(0);
  }

  private static getInvestmentStatus(root: Element): Element {
    const investmentNode = root.getElementsByTagName('INVSTMTMSGSRSV1');
    if (!investmentNode || !investmentNode.item(0)) {
      return null;
    }
    const statementRsNode = investmentNode
      .item(0)
      .getElementsByTagName('INVSTMTTRNRS');
    return statementRsNode.item(0);
  }

  private static getCreditCardStatus(root: Element): Element {
    const creditCardNode = root.getElementsByTagName('CREDITCARDMSGSRSV1');
    if (!creditCardNode || !creditCardNode.item(0)) {
      return null;
    }
    const statementRsNode = creditCardNode
      .item(0)
      .getElementsByTagName('CCSTMTTRNRS');
    return statementRsNode.item(0);
  }

  private static convertStatusToJSON(statusNode: Element): OfxStatus {
    if (!statusNode) {
      return null;
    }
    const statusXML = statusNode.getElementsByTagName('STATUS').item(0);
    if (!statusXML) {
      return null;
    }
    return {
      CODE: statusXML.getElementsByTagName('CODE').item(0).childNodes[0]
        .nodeValue,
      MESSAGE: statusXML.getElementsByTagName('MESSAGE').item(0)
        ? statusXML.getElementsByTagName('MESSAGE').item(0).childNodes[0]
            .nodeValue
        : '',
      SEVERITY: statusXML.getElementsByTagName('SEVERITY').item(0).childNodes[0]
        .nodeValue
    };
  }

  private static cleanXML(ofxPart) {
    return (
      ofxPart
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
        .replace(/<\/<added>(\w+?)>(<\/\1>)?/g, '</$1>')
    );
  }
}
