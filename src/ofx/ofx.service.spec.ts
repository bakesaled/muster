import { OfxService } from './ofx.service';

describe('OfxService', () => {
  let service: OfxService;

  beforeEach(async () => {
    service = new OfxService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
