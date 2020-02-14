import { OfxRequestService } from '../ofx';
import * as promptly from 'promptly';
import { OfxOptions } from '../ofx';

const main = async () => {
  try {
    const requestOptions: OfxOptions = {
      url: 'https://ofx.schwab2.com/bankcgi_dev/ofx_server',
      fid: '101',
      fidOrg: 'ISC',
      bankId: '121202211',
      user: '',
      password: '',
      ofxHeaderVer: '100',
      ofxVer: '102',
      app: 'QWIN',
      appVer: '1700',
      headers: [
        'Host',
        'Accept',
        'User-Agent',
        'Content-Type',
        'Content-Length',
        'Connection'
      ],
      'User-Agent': 'muster',
      'Content-Type': 'application/x-ofx',
      Accept: 'application/ofx',
      Connection: 'Close'
    };
    const validator = function(value) {
      if (value === null || value.length < 1) {
        throw new Error('A value is required.');
      }

      return value;
    };
    requestOptions.user = await promptly.prompt('username: ', {
      validator: validator,
      retry: false
    });
    requestOptions.password = await promptly.password('password: ');

    const ofxRequestService = new OfxRequestService(requestOptions);
    const results = await ofxRequestService.getAccounts();
    console.info('results', JSON.stringify(results));
  } catch (e) {
    console.error('error', e);
  }
};

main();
