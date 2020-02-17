import { OfxStatus } from './ofx-status';

export interface CommStatusModel {
  statusCode: string;
  generalStatus?: OfxStatus;
  friendlyStatus?: string;
  detailedStatus?: string;
  challengeRequestStatus: boolean;
}
