import { OfxStatus } from './ofx-status';
import { OfxResponseStatus } from './ofx-response';
import { CommStatusModel } from './comm-status.model';

export class OfxStatusAdapter {
  public static convertToStatus(
    ofxSignOnStatus: OfxResponseStatus,
    ofxSpecificStatus: OfxResponseStatus
  ): CommStatusModel {
    const signOnStatus = OfxStatusAdapter.convert(ofxSignOnStatus);
    if (!ofxSpecificStatus) {
      return signOnStatus;
    }
    const specificStatus = OfxStatusAdapter.convert(ofxSpecificStatus);
    if (
      signOnStatus.generalStatus === OfxStatus.Success &&
      specificStatus.generalStatus === OfxStatus.Success
    ) {
      return signOnStatus;
    }
    if (specificStatus.generalStatus !== OfxStatus.Success) {
      return specificStatus;
    }
    return signOnStatus;
  }

  public static convert(responseStatus: OfxResponseStatus): CommStatusModel {
    const result: CommStatusModel = {
      statusCode: responseStatus.CODE,
      challengeRequestStatus: false
    };

    switch (responseStatus.CODE) {
      case '0':
        result.generalStatus = OfxStatus.Success;
        result.friendlyStatus = 'Success';
        break;
      case '2000':
        result.generalStatus = OfxStatus.Error;
        result.friendlyStatus = responseStatus.MESSAGE
          ? responseStatus.MESSAGE
          : 'A general error occurred';
        result.detailedStatus = responseStatus.MESSAGE;
        break;
      case '3000':
        result.generalStatus = OfxStatus.Error;
        result.friendlyStatus = responseStatus.MESSAGE;
        result.detailedStatus = responseStatus.MESSAGE;
        result.challengeRequestStatus = true;
        break;
      case '3001':
        result.generalStatus = OfxStatus.Error;
        result.friendlyStatus = responseStatus.MESSAGE;
        result.challengeRequestStatus = true;
        break;
      case '13504':
        result.generalStatus = OfxStatus.Error;
        result.friendlyStatus = 'Invalid financial institution';
        result.detailedStatus = responseStatus.MESSAGE;
        break;
      case '13505':
        result.generalStatus = OfxStatus.ServerDown;
        result.friendlyStatus =
          'Server undergoing maintenance.  Try again later.';
        result.detailedStatus = responseStatus.MESSAGE;
        break;
      case '15000':
        result.generalStatus = OfxStatus.Error;
        result.friendlyStatus = 'Password must be changed';
        result.detailedStatus = responseStatus.MESSAGE;
        break;
      case '15500':
        result.generalStatus = OfxStatus.Error;
        result.friendlyStatus = 'Invalid sign-in information';
        result.detailedStatus = responseStatus.MESSAGE;
        break;
      case '15501':
        result.generalStatus = OfxStatus.Error;
        result.friendlyStatus = 'User is already logged in from another device';
        result.detailedStatus = responseStatus.MESSAGE;
        break;
      case '15502':
        result.generalStatus = OfxStatus.Error;
        result.friendlyStatus = 'Account has been locked';
        result.detailedStatus = responseStatus.MESSAGE;
        break;
      case '15511':
        result.generalStatus = OfxStatus.Error;
        result.friendlyStatus = 'Contact your financial institution';
        result.detailedStatus = responseStatus.MESSAGE;
        break;
      default:
        result.generalStatus = OfxStatus.Error;
        result.friendlyStatus = 'Unknown error occurred';
        result.detailedStatus = responseStatus.MESSAGE;
        break;
    }

    return result;
  }
}
