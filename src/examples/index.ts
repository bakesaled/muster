import {
  OfxOptions,
  OfxDateRange,
  OfxRequestService,
  OfxDateUtil,
  OfxResultValidator,
  OfxConnectionError
} from '../ofx';
import * as prompts from 'prompts';
import { subMonths } from 'date-fns';
import * as fs from 'fs';

const main = async () => {
  try {
    let requestOptions: OfxOptions = {
      url: 'https://ofx.schwab.com/bankcgi_dev/ofx_server',
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

    const filePrompt = await prompts({
      type: 'toggle',
      name: 'value',
      message: 'load options from file?',
      initial: true,
      active: 'yes',
      inactive: 'no'
    });
    if (filePrompt.value) {
      const fileNameAnswer = await prompts({
        type: 'text',
        name: 'value',
        message: 'file name: '
      });
      const fileContents = fs.readFileSync(
        `input/${fileNameAnswer.value}`,
        'utf8'
      );
      requestOptions = JSON.parse(fileContents);
      console.info('file loaded.');
    }

    const choice = await prompts({
      type: 'select',
      name: 'value',
      message: 'Get an account or a statement?',
      choices: [
        { title: 'Account', value: 0 },
        { title: 'Statement', value: 1 }
      ]
    });
    let dateRange: OfxDateRange;
    if (choice.value === 1) {
      const acctType = await prompts({
        type: 'select',
        name: 'value',
        message: 'Account Type?',
        choices: [
          { title: 'NONE', value: undefined },
          { title: 'CHECKING', value: 'CHECKING' },
          { title: 'SAVINGS', value: 'SAVINGS' },
          { title: 'MONEYMARKET', value: 'MONEYMARKET' },
          { title: 'CREDITLINE', value: 'CREDITLINE' },
          { title: 'CD', value: 'CD' },
          { title: 'CREDITCARD', value: 'CREDITCARD' },
          { title: 'INVESTMENT', value: 'INVESTMENT' }
        ]
      });
      requestOptions.accType = acctType.value;
      const acctId = await prompts({
        type: 'text',
        name: 'value',
        message: 'account #: '
      });
      requestOptions.accId = acctId.value;
      const now = new Date();
      const dateRangeStartAnswer = await prompts({
        type: 'date',
        name: 'value',
        message: 'start date: ',
        initial: subMonths(now, 1)
      });
      const dateRangeEndAnswer = await prompts({
        type: 'date',
        name: 'value',
        message: 'end date: '
      });
      dateRange = {
        start: OfxDateUtil.DateToOfxDate(dateRangeStartAnswer.value),
        end: OfxDateUtil.DateToOfxDate(dateRangeEndAnswer.value)
      };
    }
    const usernameAnswer = await prompts({
      type: 'text',
      name: 'username',
      message: 'username: ',
      validate: val =>
        val !== null && val.length > 0 ? true : 'username is required.'
    });
    requestOptions.user = usernameAnswer.username;
    const passwordAnswer = await prompts({
      type: 'invisible',
      name: 'password',
      message: 'password: ',
      validate: val =>
        val !== null && val.length > 0 ? true : 'password is required.'
    });
    requestOptions.password = passwordAnswer.password;

    const ofxRequestService = new OfxRequestService(requestOptions);
    let results: string;
    let commStatus;
    try {
      if (choice.value === 1) {
        results = await ofxRequestService.getStatement(dateRange);
      } else {
        results = await ofxRequestService.getAccounts();
      }
      commStatus = OfxResultValidator.validate(results);
    } catch (err) {
      if (err instanceof OfxConnectionError) {
        commStatus = OfxResultValidator.validate(results, {
          code: err.errorCode,
          message: err.message
        });
      }
    }
    console.info('success!', commStatus);
    const saveAnswer = await prompts({
      type: 'toggle',
      name: 'value',
      message: 'save to file?',
      initial: true,
      active: 'yes',
      inactive: 'no'
    });
    if (saveAnswer.value) {
      const fileNameAnswer = await prompts({
        type: 'text',
        name: 'value',
        message: 'file name: '
      });
      const writeStream = fs.createWriteStream(
        `output/${fileNameAnswer.value}`
      );
      writeStream.write(results, 'utf8');
      writeStream.on('finish', () => {
        console.info('file saved.');
      });
      writeStream.end();
    } else {
      console.info('done');
    }
  } catch (e) {
    console.error('error', e);
  }
};

main();
