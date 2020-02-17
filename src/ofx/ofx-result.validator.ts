import { OfxBody } from './ofx-response';
import { OfxStatusAdapter } from './ofx-status.adapter';

export class OfxResultValidator {
  public static validate(res: OfxBody) {
    let specificStatus;
    if (res.OFX.INVSTMTMSGSRSV1) {
      specificStatus = res.OFX.INVSTMTMSGSRSV1.INVSTMTTRNRS.STATUS;
    } else if (res.OFX.CREDITCARDMSGSRSV1) {
      specificStatus = res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.STATUS;
    } else if (res.OFX.BANKMSGSRSV1) {
      specificStatus = res.OFX.BANKMSGSRSV1.STMTTRNRS.STATUS;
    } else {
      specificStatus = res.OFX.SIGNONMSGSRSV1.SONRS.STATUS;
    }
    return OfxStatusAdapter.convertToStatus(
      res.OFX.SIGNONMSGSRSV1.SONRS.STATUS,
      specificStatus
    );
  }
}
