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
  // | 'systemIntakes'
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
  expectedEndDate: yup.string(),
  systemIntakes: yup.array(yup.string().required()).ensure(),
  collabGroups: yup
    .array(
      yup
        .mixed()
        .oneOf<TRBCollabGroupOption>(Object.values(TRBCollabGroupOption))
        .required()
    )
    .min(1)
    .ensure(),
  collabDateSecurity: yup.string().when('collabGroups', {
    is: (v: any) => Array.isArray(v) && v.includes('SECURITY'),
    then: schema => schema.required()
  }),
  collabDateEnterpriseArchitecture: yup.string().when('collabGroups', {
    is: (v: any) => Array.isArray(v) && v.includes('ENTERPRISE_ARCHITECTURE'),
    then: schema => schema.required()
  }),
  collabDateCloud: yup.string().when('collabGroups', {
    is: (v: any) => Array.isArray(v) && v.includes('CLOUD'),
    then: schema => schema.required()
  }),
  collabDatePrivacyAdvisor: yup.string().when('collabGroups', {
    is: (v: any) => Array.isArray(v) && v.includes('PRIVACY_ADVISOR'),
    then: schema => schema.required()
  }),
  collabDateGovernanceReviewBoard: yup.string().when('collabGroups', {
    is: (v: any) => Array.isArray(v) && v.includes('GOVERNANCE_REVIEW_BOARD'),
    then: schema => schema.required()
  }),
  collabGRBConsultRequested: yup
    .boolean()
    .nullable()
    .when('collabGroups', {
      is: (v: any) => Array.isArray(v) && v.includes('GOVERNANCE_REVIEW_BOARD'),
      then: schema => schema.required()
    }),
  collabGroupOther: yup.string().when('collabGroups', {
    is: (v: any) => Array.isArray(v) && v.includes('OTHER'),
    then: schema => schema.required()
  }),
  collabDateOther: yup.string().when('collabGroups', {
    is: (v: any) => Array.isArray(v) && v.includes('OTHER'),
    then: schema => schema.required()
  })
});
export interface TrbRequestFormBasic extends TrbFormInputBasic {
  name: string;
}

export const basicSchema: yup.SchemaOf<TrbRequestFormBasic> = inputBasicSchema.concat(
  yup.object({
    name: yup.string().required()
  })
);

export const trbRequesterSchema = yup.object({
  euaUserId: yup.string().required('Requester name is a required field'),
  component: yup
    .string()
    .nullable()
    .required('Requester component is a required field'),
  role: yup
    .mixed<PersonRole>()
    .nullable()
    .oneOf(Object.values(PersonRole))
    .required('Requester role is a required field')
});

export const trbAttendeeSchema = yup.object({
  euaUserId: yup.string().required('Attendee name is a required field'),
  component: yup.string().required('Attendee component is a required field'),
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

// Advice letter form schemas

export const adviceRecommendationSchema = yup.object({
  title: yup.string().required(),
  recommendation: yup.string().required(),
  links: yup.array(yup.string())
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
