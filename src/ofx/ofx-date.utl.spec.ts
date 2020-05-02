import { OfxDateUtil } from './ofx-date.util';

describe('OfxDateUtil', () => {
  it('should convert date string to ofx date', () => {
    const result = OfxDateUtil.DateToOfxDate(new Date(2017, 0, 31));
    expect(result).toEqual('20170131');
  });

  it('should convert date string to ofx date', () => {
    const result = OfxDateUtil.DateToOfxDate(new Date('2017-01-31'));
    expect(result).toEqual('20170131');
  });
});
