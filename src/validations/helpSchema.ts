import * as Yup from 'yup';

import {
  easiServiceOptionKeys,
  sendFeedbackOptionFields,
  SendFeedbackOptionKey,
  sendFeedbackOptions
} from 'constants/helpFeedback';
import { SendFeedbackEmailInput } from 'types/graphql-global-types';
import { SendFeedbackEmailForm } from 'types/helpFeedback';

// todo consider using exports from i18
export const msgSelect = 'Please make a selection';
export const msgExplain = 'Please include an explanation';

function getFeedbackOptionValues(
  options: Readonly<SendFeedbackOptionKey[]>
): Array<typeof sendFeedbackOptions[keyof typeof sendFeedbackOptions]> {
  return options.map(op => sendFeedbackOptions[op]);
}

/**
 * Form input data schema based on original backend type.
 */
export const sendFeedbackEmailInputSchema: Yup.SchemaOf<SendFeedbackEmailInput> = Yup.object(
  {
    isAnonymous: Yup.boolean().required(),
    canBeContacted: Yup.boolean().required(),
    easiServicesUsed: Yup.array().of(Yup.string().required()).required(),
    cmsRole: Yup.string().required(),
    systemEasyToUse: Yup.string().required(),
    didntNeedHelpAnswering: Yup.string().required(),
    questionsWereRelevant: Yup.string().required(),
    hadAccessToInformation: Yup.string().required(),
    howSatisfied: Yup.string().required(),
    howCanWeImprove: Yup.string().required()
  }
);

/**
 * The final ui form schema as an extension of other schemas onto the base backend input schema.
 */
export const sendFeedbackEmailFormSchema: Yup.SchemaOf<SendFeedbackEmailForm> = sendFeedbackEmailInputSchema.concat(
  Yup.object({
    isAnonymous: Yup.boolean().nullable().default(null).required(msgSelect),

    /**
     * The `canBeContacted` field depends on `isAnonymous`.
     * Make sure this is false if `isAnonymous` is true.
     */
    canBeContacted: Yup.boolean()
      .nullable()
      .default(null)
      .when('isAnonymous', {
        is: false,
        then: schema => schema.required(msgSelect)
      }),

    easiServicesUsed: Yup.array()
      .of(
        Yup.string()
          .oneOf(getFeedbackOptionValues(easiServiceOptionKeys))
          .required()
      )
      .default([])
      .min(1, msgSelect),
    easiServicesUsedAdditionalText: Yup.string()
      .default('')
      .when('easiServicesUsed', {
        is: (v: any) =>
          Array.isArray(v) && v.includes(sendFeedbackOptions.other),
        then: schema => schema.required(msgExplain)
      }),

    cmsRole: Yup.string().default('').required('Please enter a role'),

    systemEasyToUse: Yup.string()
      .default('')
      .oneOf(
        getFeedbackOptionValues(
          sendFeedbackOptionFields.systemEasyToUse.options
        ),
        msgSelect
      )
      .required(),
    systemEasyToUseAdditionalText: Yup.string()
      .default('')
      .when('systemEasyToUse', {
        is: sendFeedbackOptions.imNotSure,
        then: schema => schema.required(msgExplain)
      }),

    didntNeedHelpAnswering: Yup.string()
      .default('')
      .oneOf(
        getFeedbackOptionValues(
          sendFeedbackOptionFields.didntNeedHelpAnswering.options
        ),
        msgSelect
      )
      .required(),
    didntNeedHelpAnsweringAdditionalText: Yup.string()
      .default('')
      .when('didntNeedHelpAnswering', {
        is: sendFeedbackOptions.imNotSure,
        then: schema => schema.required(msgExplain)
      }),

    questionsWereRelevant: Yup.string()
      .default('')
      .oneOf(
        getFeedbackOptionValues(
          sendFeedbackOptionFields.questionsWereRelevant.options
        ),
        msgSelect
      )
      .required(),
    questionsWereRelevantAdditionalText: Yup.string()
      .default('')
      .when('questionsWereRelevant', {
        is: sendFeedbackOptions.imNotSure,
        then: schema => schema.required(msgExplain)
      }),

    hadAccessToInformation: Yup.string()
      .default('')
      .oneOf(
        getFeedbackOptionValues(
          sendFeedbackOptionFields.hadAccessToInformation.options
        ),
        msgSelect
      )
      .required(),
    hadAccessToInformationAdditionalText: Yup.string()
      .default('')
      .when('hadAccessToInformation', {
        is: sendFeedbackOptions.imNotSure,
        then: schema => schema.required(msgExplain)
      }),

    howSatisfied: Yup.string()
      .default('')
      .oneOf(
        getFeedbackOptionValues(sendFeedbackOptionFields.howSatisfied.options),
        msgSelect
      )
      .required(),

    howCanWeImprove: Yup.string().default('').required(msgExplain)
  })
);
