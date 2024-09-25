import * as Yup from 'yup';

import {
  easiServiceOptionKeys,
  reportOptionFields,
  SendFeedbackEmailForm,
  sendFeedbackOptionFields,
  SendFeedbackOptionKey,
  sendFeedbackOptions,
  SendReportAProblemEmailForm
} from 'constants/helpFeedback';
import helpText from 'i18n/en-US/help';
import {
  SendFeedbackEmailInput,
  SendReportAProblemEmailInput
} from 'types/graphql-global-types';

const msgSelect = helpText.sendFeedback.errorMessage.select;
const msgExplain = helpText.sendFeedback.errorMessage.explain;

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
        getFeedbackOptionValues(sendFeedbackOptionFields.systemEasyToUse),
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
          sendFeedbackOptionFields.didntNeedHelpAnswering
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
        getFeedbackOptionValues(sendFeedbackOptionFields.questionsWereRelevant),
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
          sendFeedbackOptionFields.hadAccessToInformation
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
        getFeedbackOptionValues(sendFeedbackOptionFields.howSatisfied),
        msgSelect
      )
      .required(),

    howCanWeImprove: Yup.string().default('').required(msgExplain)
  })
);

export const sendReportAProblemEmailInputSchema: Yup.SchemaOf<SendReportAProblemEmailInput> = Yup.object(
  {
    isAnonymous: Yup.boolean().required(),
    canBeContacted: Yup.boolean().required(),
    easiService: Yup.string().required(),
    whatWereYouDoing: Yup.string().required(),
    whatWentWrong: Yup.string().required(),
    howSevereWasTheProblem: Yup.string().required()
  }
);

export const sendReportAProblemEmailFormSchema: Yup.SchemaOf<SendReportAProblemEmailForm> = sendReportAProblemEmailInputSchema.concat(
  Yup.object({
    isAnonymous: Yup.boolean().nullable().default(null).required(msgSelect),

    canBeContacted: Yup.boolean()
      .nullable()
      .default(null)
      .when('isAnonymous', {
        is: false,
        then: schema => schema.required(msgSelect)
      }),

    easiService: Yup.string()
      .oneOf(getFeedbackOptionValues(easiServiceOptionKeys), msgSelect)
      .required(msgSelect),
    easiServiceAdditionalText: Yup.string()
      .default('')
      .when('easiService', {
        is: sendFeedbackOptions.other,
        then: schema => schema.required(msgExplain)
      }),

    whatWereYouDoing: Yup.string().default('').required(msgExplain),

    whatWentWrong: Yup.string().default('').required(msgExplain),

    howSevereWasTheProblem: Yup.string()
      .oneOf(
        getFeedbackOptionValues(reportOptionFields.howSevereWasTheProblem),
        msgSelect
      )
      .required(msgSelect),
    howSevereWasTheProblemAdditionalText: Yup.string()
      .default('')
      .when('howSevereWasTheProblem', {
        is: sendFeedbackOptions.other,
        then: schema => schema.required(msgExplain)
      })
  })
);
