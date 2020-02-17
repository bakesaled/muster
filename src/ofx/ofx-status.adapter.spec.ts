import { OfxStatusAdapter } from './ofx-status.adapter';
import { OfxStatus } from './ofx-status';

describe('OfxStatusAdapter', () => {
  let adapter: OfxStatusAdapter;
  beforeEach(() => {
    adapter = new OfxStatusAdapter();
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });

  it('should return correct result for a success', () => {
    const result = OfxStatusAdapter.convertToStatus(
      {
        CODE: '0',
        MESSAGE: 'Success',
        SEVERITY: ''
      },
      {
        CODE: '0',
        MESSAGE: 'Success',
        SEVERITY: ''
      }
    );

    expect(result).toBeDefined();
    expect(result.generalStatus).toBe(OfxStatus.Success);
    expect(result.challengeRequestStatus).toBe(false);
  });

  it('should return correct result for an unknown error', () => {
    const result = OfxStatusAdapter.convertToStatus(
      {
        CODE: '0',
        MESSAGE: 'Success',
        SEVERITY: ''
      },
      {
        CODE: 'blue',
        MESSAGE: 'not sure',
        SEVERITY: ''
      }
    );

    expect(result).toBeDefined();
    expect(result.generalStatus).toBe(OfxStatus.Error);
    expect(result.friendlyStatus).toBe('Unknown error occurred');
    expect(result.detailedStatus).toBe('not sure');
    expect(result.challengeRequestStatus).toBe(false);
  });
});
