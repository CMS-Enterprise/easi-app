import { parseReportForm } from 'features/Help/Feedback/ReportAProblem/ReportAProblem';
import { parseFeedbackForm } from 'features/Help/Feedback/SendFeedback';
import { cloneDeep } from 'lodash';

import {
  ADDITIONAL_TEXT_INPUT_SUFFIX,
  ReportOptionFieldForTextInputKey,
  reportOptionFieldsForTextInput,
  SendFeedbackEmailForm,
  SendFeedbackOptionFieldForTextInputKey,
  sendFeedbackOptionFieldsForTextInput,
  SendFeedbackOptionKey,
  sendFeedbackOptions,
  SendReportAProblemEmailForm
} from 'constants/helpFeedback';
import helpText from 'i18n/en-US/help';

import {
  sendFeedbackEmailFormSchema,
  sendFeedbackEmailInputSchema,
  sendReportAProblemEmailFormSchema,
  sendReportAProblemEmailInputSchema
} from './helpSchema';

describe('Help / Send Feedback schema validation', () => {
  const minimumRequiredForm = {
    canBeContacted: true,
    cmsRole: 'Mascot #2',
    didntNeedHelpAnswering: 'Agree',
    easiServicesUsed: ['Systems', 'IT Governance'],
    hadAccessToInformation: 'I didn’t fill out a form in EASi',
    howCanWeImprove:
      'The solution is to add an alternative that allows for the uncovered situation.',
    howSatisfied: 'Very satisfied',
    isAnonymous: false,
    questionsWereRelevant: 'Disagree',
    systemEasyToUse: 'Agree'
  };

  it('passes backend input validation', async () => {
    await expect(
      sendFeedbackEmailInputSchema.validate(minimumRequiredForm)
    ).resolves.toBeDefined();
  });

  it(`errors on an empty form`, async () => {
    await expect(sendFeedbackEmailInputSchema.validate({})).rejects.toThrow();
  });

  it.each([
    'easiServicesUsed',
    'systemEasyToUse',
    'didntNeedHelpAnswering',
    'questionsWereRelevant',
    'hadAccessToInformation',
    'howSatisfied'
  ])(`errors on other values in enum text field: %s`, async inputKey => {
    await expect(() => {
      let optionVal: any = 'buz';
      // `easiServicesUsed` option value is in a list
      if (inputKey === 'easiServicesUsed') {
        optionVal = [optionVal];
      }
      return sendFeedbackEmailFormSchema.fields[
        inputKey as keyof SendFeedbackEmailForm
      ].validate(optionVal);
    }).rejects.toThrow();
  });

  it.each(Object.keys(sendFeedbackOptionFieldsForTextInput))(
    'errors on empty additional text field: %s',
    async inputKey => {
      let optionVal: any =
        sendFeedbackOptions[
          sendFeedbackOptionFieldsForTextInput[
            inputKey as SendFeedbackOptionFieldForTextInputKey
          ] as SendFeedbackOptionKey
        ];

      // `easiServicesUsed` option value is in a list
      if (inputKey === 'easiServicesUsed') {
        optionVal = [optionVal];
      }

      await expect(() => {
        const form = {
          ...cloneDeep(minimumRequiredForm),
          [inputKey]: optionVal,
          [`${inputKey}${ADDITIONAL_TEXT_INPUT_SUFFIX}`]: ''
        };
        return sendFeedbackEmailFormSchema.validate(form);
      }).rejects.toThrow(helpText.sendFeedback.errorMessage.explain);
    }
  );

  it('parses form fields to be ready for submission', async () => {
    const input: SendFeedbackEmailForm = {
      howCanWeImprove:
        'The solution is to add an alternative that allows for the uncovered situation.',
      cmsRole: 'Mascot',
      canBeContacted: true,
      isAnonymous: false,
      howSatisfied: 'Very satisfied',
      hadAccessToInformation: 'I didn’t fill out a form in EASi',
      hadAccessToInformationAdditionalText: 'This should not appear in parsed',
      questionsWereRelevant: 'Disagree',
      questionsWereRelevantAdditionalText: '',
      didntNeedHelpAnswering: 'Agree',
      didntNeedHelpAnsweringAdditionalText: '',
      systemEasyToUse: 'I’m not sure',
      systemEasyToUseAdditionalText: 'We need to talk',
      easiServicesUsed: ['Systems', 'IT Governance', 'Other'],
      easiServicesUsedAdditionalText: 'MCP'
    };
    const expected = {
      canBeContacted: true,
      cmsRole: 'Mascot',
      didntNeedHelpAnswering: 'Agree',
      easiServicesUsed: ['Systems', 'IT Governance', 'Other: MCP'],
      hadAccessToInformation: 'I didn’t fill out a form in EASi',
      howCanWeImprove:
        'The solution is to add an alternative that allows for the uncovered situation.',
      howSatisfied: 'Very satisfied',
      isAnonymous: false,
      questionsWereRelevant: 'Disagree',
      systemEasyToUse: 'I’m not sure: We need to talk'
    };
    expect(await parseFeedbackForm(input)).toEqual(expected);
  });
});

describe('Help / Report A Problem schema validation', () => {
  const minimumRequiredForm = {
    isAnonymous: true,
    canBeContacted: false,
    easiService: 'Help',
    whatWereYouDoing: 'For a much less spectacular failure',
    whatWentWrong: 'Those tools have evolved',
    howSevereWasTheProblem: 'It prevented me from completing my task'
  };

  it('passes backend input validation', async () => {
    await expect(
      sendReportAProblemEmailInputSchema.validate(minimumRequiredForm)
    ).resolves.toBeDefined();
  });

  it(`errors on an empty form`, async () => {
    await expect(
      sendReportAProblemEmailInputSchema.validate({})
    ).rejects.toThrow();
  });

  it.each(['easiService', 'howSevereWasTheProblem'])(
    `errors on other values in enum text field: %s`,
    async inputKey => {
      await expect(() => {
        return sendReportAProblemEmailFormSchema.fields[
          inputKey as keyof SendReportAProblemEmailForm
        ].validate('foo');
      }).rejects.toThrow();
    }
  );

  it.each(Object.keys(reportOptionFieldsForTextInput))(
    'errors on empty additional text field: %s',
    async inputKey => {
      const optionVal: any =
        sendFeedbackOptions[
          reportOptionFieldsForTextInput[
            inputKey as ReportOptionFieldForTextInputKey
          ] as SendFeedbackOptionKey
        ];

      await expect(() => {
        const form = {
          ...cloneDeep(minimumRequiredForm),
          [inputKey]: optionVal,
          [`${inputKey}${ADDITIONAL_TEXT_INPUT_SUFFIX}`]: ''
        };
        return sendReportAProblemEmailFormSchema.validate(form);
      }).rejects.toThrow(helpText.sendFeedback.errorMessage.explain);
    }
  );

  it('parses form fields to be ready for submission', async () => {
    const input: SendReportAProblemEmailForm = {
      isAnonymous: true,
      canBeContacted: false,
      easiService: 'Other',
      easiServiceAdditionalText: 'Free space',
      whatWereYouDoing: 'For a much less spectacular failure',
      whatWentWrong: 'Those tools have evolved',
      howSevereWasTheProblem: 'Other',
      howSevereWasTheProblemAdditionalText: 'Hot water'
    };
    const expected = {
      isAnonymous: true,
      canBeContacted: false,
      easiService: 'Other: Free space',
      whatWereYouDoing: 'For a much less spectacular failure',
      whatWentWrong: 'Those tools have evolved',
      howSevereWasTheProblem: 'Other: Hot water'
    };
    expect(await parseReportForm(input)).toEqual(expected);
  });
});
