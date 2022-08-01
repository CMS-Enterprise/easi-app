import { cloneDeep } from 'lodash';

import {
  ADDITIONAL_TEXT_INPUT_SUFFIX,
  sendFeedbackOptionFieldsForTextInput,
  SendFeedbackOptionKey,
  sendFeedbackOptions
} from 'constants/helpFeedback';
import {
  SendFeedbackEmailForm,
  SendFeedbackOptionFieldForTextInputKey
} from 'types/helpFeedback';
import { parseForm } from 'views/Help/SendFeedback';

import {
  msgExplain,
  sendFeedbackEmailFormSchema,
  sendFeedbackEmailInputSchema
} from './helpSchema';

describe('Help forms schema validation', () => {
  const minimumRequiredForm = {
    canBeContacted: true,
    cmsRole: 'Mascot #2',
    didntNeedHelpAnswering: 'Agree',
    easiServicesUsed: ['Systems', 'IT Governance', 'Section 508'],
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
      }).rejects.toThrow(msgExplain);
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
    expect(await parseForm(input)).toEqual(expected);
  });
});
