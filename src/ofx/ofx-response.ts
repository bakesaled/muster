export interface OfxResponse {
  header: any;
  body: OfxBody;
  xml: string;
  message?: string;
}

export interface OfxBody {
  OFX: {
    SIGNONMSGSRSV1: {
      SONRS: {
        STATUS: OfxResponseStatus;
        DTSERVER: string;
        LANGUAGE: string;
        FI: {
          ORG: string;
          FID: string;
        };
      };
    };
    SIGNUPMSGSRSV1: {
      ACCTINFOTRNRS: {
        TRNUID: string;
        ACCTINFORS: {
          DTACCTUP: string;
          ACCTINFO:
            | OfxCreditCardAccount
            | OfxCreditCardAccount[]
            | OfxInvestmentAccount
            | OfxInvestmentAccount[]
            | OfxBankAccount
            | OfxBankAccount[];
        };
        STATUS: OfxResponseStatus;
      };
    };
    BANKMSGSRSV1: OfxBankMessage;
    INVSTMTMSGSRSV1: OfxInvestmentMessage;
    CREDITCARDMSGSRSV1: OfxCreditCardMessage;
  };
}

export interface OfxBankMessage {
  STMTTRNRS: {
    TRNUID: string;
    STATUS: OfxResponseStatus;
    CLTCOOKIE: string;
    STMTRS: {
      CURDEF: string;
      BANKACCTFROM: OfxBankAccountFrom;
      BANKTRANLIST: {
        DTSTART: string;
        DTEND: string;
        STMTTRN: Array<OfxStatementTransaction>;
      };
      LEDGERBAL: OfxBalance;
      AVAILBAL: OfxBalance;
    };
  };
}

export interface OfxBankAccountFrom {
  BANKID: string;
  ACCTID: string;
  ACCTTYPE?:
    | 'CHECKING'
    | 'SAVINGS'
    | 'MONEYMARKET'
    | 'MONEYMRKT'
    | 'CREDITLINE'
    | 'CD'
    | 'CREDITCARD'
    | 'INVESTMENT'
    | undefined;
}

export interface OfxInvestmentMessage {
  INVSTMTTRNRS: {
    TRNUID: string;
    STATUS: OfxResponseStatus;
    INVSTMTRS: OfxInvestmentStatementResponse;
  };
}

export interface OfxInvestmentStatementResponse {
  DTASOF: string;
  CURDEF: string;
  INVACCTFROM: {
    BROKERID: string;
    ACCTID: string;
  };
  INVTRANLIST: OfxInvestmentTransactionList;
  INVPOSLIST: {
    POSMF?: OfxInvestmentPositionType | Array<OfxInvestmentPositionType>;
    POSSTOCK?: OfxInvestmentPositionType | Array<OfxInvestmentPositionType>;
    POSDEBT?: OfxInvestmentPositionType | Array<OfxInvestmentPositionType>;
    POSOPT?: OfxInvestmentPositionType | Array<OfxInvestmentPositionType>;
    POSOTHER?: OfxInvestmentPositionType | Array<OfxInvestmentPositionType>;
  };
  INVBAL: OfxInvestmentBalance;
}

export interface OfxInvestmentTransactionList {
  DTSTART: string;
  DTEND: string;
  INVBANKTRAN?: Array<OfxInvestmentBankTransaction>;
  BUYOTHER?: Array<OfxInvestmentBuyOtherTransaction>;
  BUYMF?: Array<OfxInvestmentBuyMfTransaction>;
  INCOME?: Array<OfxInvestmentIncomeTransaction>;
}

export interface OfxInvestmentBuyOtherTransaction {
  INVBUY: {
    INVTRAN: OfxInvestmentTransaction;
    SECID: OfxInvestmentSecId;
    UNITS: string;
    UNITPRICE: string;
    TOTAL: string;
    SUBACCTSEC: string;
    AUBACCTFUND: string;
  };
}

export interface OfxInvestmentBuyMfTransaction {
  INVBUY: {
    INVTRAN: OfxInvestmentTransaction;
    SECID: OfxInvestmentSecId;
    UNITS: string;
    UNITPRICE: string;
    TOTAL: string;
    SUBACCTSEC: string;
    AUBACCTFUND: string;
  };
}

export interface OfxInvestmentSecId {
  UNIQUEID: string;
  UNIQUEIDTYPE: string;
}

export interface OfxInvestmentIncomeTransaction {
  INVTRAN: OfxInvestmentTransaction;
  SECID: OfxInvestmentSecId;
  INCOMETYPE: string;
  TOTAL: string;
  SUBACCTSEC: string;
  SUBACCTFUND: string;
}

export interface OfxInvestmentTransaction {
  FITID: string;
  SRVRTID: string;
  DTTRADE: string;
  DTSETTLE: string;
  REVERSALFITID: string;
  MEMO: string;
}

export interface OfxInvestmentBankTransaction {
  STMTTRN: OfxStatementTransaction;
}

export interface OfxCreditCardMessage {
  CCSTMTTRNRS: {
    TRNUID: string;
    STATUS: OfxResponseStatus;
    CLTCOOKIE: string;
    CCSTMTRS: {
      CURDEF: string;
      CCACCTFROM: {
        ACCTID: string;
        ACCTTYPE: string;
      };
      BANKTRANLIST: {
        DTSTART: string;
        DTEND: string;
        STMTTRN: Array<OfxStatementTransaction>;
      };
      LEDGERBAL: OfxBalance;
      AVAILBAL: OfxBalance;
    };
  };
}

export interface OfxBalance {
  BALAMT: string;
  DTASOF: string;
}

export interface OfxInvestmentBalance {
  AVAILCASH: string;
}

export interface OfxResponseStatus {
  CODE: string;
  SEVERITY: string;
  MESSAGE: string;
}

export interface OfxStatementTransaction {
  TRNTYPE: string;
  DTPOSTED: string;
  DTAVAIL: string;
  TRNAMT: string;
  FITID: string;
  CHECKNUM: string;
  NAME: string;
  MEMO: string;
  CORRECTFITID?: string;
  CORRECTACTION?: 'REPLACE' | 'DELETE';
}

export interface OfxCreditCardAccount {
  CCACCTINFO: {
    CCACCTFROM: {
      ACCTID: string;
      ACCTTYPE: string;
      BANKID: string;
    };
    SUPTXDL: string;
    XFERSRC: string;
    XFERDEST: string;
    SVCSTATUS: string;
  };
}

export interface OfxInvestmentAccount {
  INVACCTINFO: {
    CHECKING: string;
    INVACCTFROM: {
      ACCTID: string;
      BROKERID: string;
    };
    SVCSTATUS: string;
    USPRODUCTTYPE: string;
  };
}

export interface OfxBankAccount {
  BANKACCTINFO: {
    BANKACCTFROM: OfxBankAccountFrom;
    SUPTXDL: string;
    XFERSRC: string;
    XFERDEST: string;
    SVCSTATUS: string;
  };
}

export interface OfxInvestmentPositionType {
  INVPOS: OfxInvestmentPosition;
}

export interface OfxInvestmentPosition {
  SECID: {
    UNIQUEID: string;
    UNIQUEIDTYPE: string;
  };
  HELDINACCT: string;
  POSTYPE: string;
  UNITS: string;
  UNITPRICE: string;
  MKTVAL: string;
  DTPRICEASOF: string;
  MEMO: string;
}
