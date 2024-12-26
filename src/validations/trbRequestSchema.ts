import { TRBGuidanceLetterInsightCategory } from 'gql/gen/graphql';
import * as yup from 'yup';

import {
  CreateTRBRequestDocumentInput,
  PersonRole,
  TRBCollabGroupOption,
  TRBDocumentCommonType,
  TRBWhereInProcessOption,
  UpdateTRBRequestFormInput
} from 'types/graphql-global-types';
// import { fileObjectSchema } from './fileSchema';

type TrbFormInputBasic = Pick<
  UpdateTRBRequestFormInput,
  | 'component'
  | 'needsAssistanceWith'
  | 'hasSolutionInMind'
  | 'proposedSolution'
  | 'whereInProcess'
  | 'whereInProcessOther'
  | 'hasExpectedStartEndDates'
  | 'expectedStartDate'
  | 'expectedEndDate'
  | 'systemIntakes'
  | 'collabGroups'
  | 'collabDateSecurity'
  | 'collabDateEnterpriseArchitecture'
  | 'collabDateCloud'
  | 'collabDatePrivacyAdvisor'
  | 'collabDateGovernanceReviewBoard'
  | 'collabDateOther'
  | 'collabGroupOther'
  | 'collabGRBConsultRequested'
>;

export const inputBasicSchema: yup.SchemaOf<TrbFormInputBasic> = yup.object({
  component: yup.string().required(),
  needsAssistanceWith: yup.string().required(),
  hasSolutionInMind: yup.boolean().nullable().required(),
  proposedSolution: yup.string().when('hasSolutionInMind', {
    is: true,
    then: schema => schema.required()
  }),
  whereInProcess: yup
    .mixed<TRBWhereInProcessOption>()
    .oneOf(Object.values(TRBWhereInProcessOption))
    .required(),
  whereInProcessOther: yup.string().when('whereInProcess', {
    is: 'OTHER',
    then: schema => schema.required()
  }),
  hasExpectedStartEndDates: yup
    .boolean()
    .nullable()
    .required()
    .test(
      'expected-start-or-end-date',
      'Provide at least one expected start or end date',
      (value, testContext) => {
        const { expectedStartDate, expectedEndDate } = testContext.parent;
        return !(value && !expectedStartDate && !expectedEndDate);
      }
    ),
  expectedStartDate: yup.string(),
  expectedEndDate: yup.string().test({
    name: 'expected-end-date-after-start-date',
    message: 'Expected end date should not be before the expected start date',
    test: (value, testContext) => {
      if (value && testContext.parent.expectedStartDate > value) return false;
      return true;
    }
  }),
  systemIntakes: yup.array(yup.mixed().required()).nullable(),
  collabGroups: yup
    .array(
      yup
        .mixed()
        .oneOf<TRBCollabGroupOption>(Object.values(TRBCollabGroupOption))
        .required()
    )
    .ensure(),
  collabDateSecurity: yup.string(),
  collabDateEnterpriseArchitecture: yup.string(),
  collabDateCloud: yup.string(),
  collabDatePrivacyAdvisor: yup.string(),
  collabDateGovernanceReviewBoard: yup.string(),
  collabGRBConsultRequested: yup
    .boolean()
    .nullable()
    .when('collabGroups', {
      is: (v: any) => Array.isArray(v) && v.includes('GOVERNANCE_REVIEW_BOARD'),
      then: schema => schema.required()
    }),
  collabGroupOther: yup.string(),
  collabDateOther: yup.string()
});
export interface TrbRequestFormBasic extends TrbFormInputBasic {
  name: string;
}

export const basicSchema: yup.SchemaOf<TrbRequestFormBasic> =
  inputBasicSchema.concat(
    yup.object({
      name: yup.string().required()
    })
  );

export const trbRequesterSchema = yup.object({
  euaUserId: yup.string().required('Requester name is a required field'),
  component: yup.string().nullable(),
  role: yup
    .mixed<PersonRole>()
    .nullable()
    .oneOf(Object.values(PersonRole))
    .required('Requester role is a required field')
});

export const trbAttendeeSchema = yup.object({
  euaUserId: yup.string().required('Attendee name is a required field'),
  component: yup.string().nullable(),
  role: yup
    .mixed<PersonRole>()
    .oneOf(Object.values(PersonRole))
    .required('Attendee role is a required field')
});

export type TrbFormInputSubjectAreas = Pick<
  UpdateTRBRequestFormInput,
  'subjectAreaOptions' | 'subjectAreaOptionOther'
>;

export type TrbRequestInputDocument = Omit<
  CreateTRBRequestDocumentInput,
  'requestID'
>;

// export const documentSchema: yup.SchemaOf<TrbRequestInputDocument> = yup.object(
export const documentSchema = yup.object({
  // fileData: fileObjectSchema.required(),
  fileData: yup.mixed().required(),
  documentType: yup
    .mixed<TRBDocumentCommonType>()
    .oneOf(Object.values(TRBDocumentCommonType))
    .required(),
  otherTypeDescription: yup.string().when('documentType', {
    is: 'OTHER',
    then: schema => schema.required()
  })
});

// Guidance letter form schemas

export const guidanceInsightSchema = yup.object({
  title: yup.string().required(),
  category: yup
    .mixed()
    .oneOf([
      TRBGuidanceLetterInsightCategory.REQUIREMENT,
      TRBGuidanceLetterInsightCategory.RECOMMENDATION,
      TRBGuidanceLetterInsightCategory.CONSIDERATION
    ])
    .required(),
  recommendation: yup.string().required(),
  links: yup.array(
    yup.object({
      link: yup.string().required()
    })
  )
});

export const meetingSummarySchema = yup.object({
  meetingSummary: yup.string().required()
});

export const nextStepsSchema = yup.object({
  nextSteps: yup.string().nullable().required(),
  isFollowupRecommended: yup.boolean().nullable().required(),
  followupPoint: yup
    .string()
    .nullable()
    .when('isFollowupRecommended', {
      is: true,
      then: schema => schema.required()
    })
});

/** TRB action form schema */
export const trbActionSchema = (messageKey?: string, required?: boolean) =>
  yup.object({
    copyTrbMailbox: yup.boolean(),
    notifyEuaIds: yup.array(yup.string()),
    ...(messageKey
      ? { [messageKey]: required ? yup.string().required() : yup.string() }
      : {})
  });

export const consultSchema = trbActionSchema('notes').shape({
  meetingDate: yup.string().required(),
  meetingTime: yup.string().required()
});
