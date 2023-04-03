import * as yup from 'yup';

import {
  CreateTRBRequestDocumentInput,
  PersonRole,
  TRBApplicationDevelopmentOption,
  TRBCloudAndInfrastructureOption,
  TRBCollabGroupOption,
  TRBDataAndDataManagementOption,
  TRBDocumentCommonType,
  TRBFeedbackAction,
  TRBGovernmentProcessesAndPoliciesOption,
  TRBNetworkAndSecurityOption,
  TRBOtherTechnicalTopicsOption,
  TRBTechnicalReferenceArchitectureOption,
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
  | 'collabGroups'
  | 'collabDateSecurity'
  | 'collabDateEnterpriseArchitecture'
  | 'collabDateCloud'
  | 'collabDatePrivacyAdvisor'
  | 'collabDateGovernanceReviewBoard'
  | 'collabDateOther'
  | 'collabGroupOther'
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
  | 'subjectAreaTechnicalReferenceArchitecture'
  | 'subjectAreaNetworkAndSecurity'
  | 'subjectAreaCloudAndInfrastructure'
  | 'subjectAreaApplicationDevelopment'
  | 'subjectAreaDataAndDataManagement'
  | 'subjectAreaGovernmentProcessesAndPolicies'
  | 'subjectAreaOtherTechnicalTopics'
  | 'subjectAreaTechnicalReferenceArchitectureOther'
  | 'subjectAreaNetworkAndSecurityOther'
  | 'subjectAreaCloudAndInfrastructureOther'
  | 'subjectAreaApplicationDevelopmentOther'
  | 'subjectAreaDataAndDataManagementOther'
  | 'subjectAreaGovernmentProcessesAndPoliciesOther'
  | 'subjectAreaOtherTechnicalTopicsOther'
>;

export const subjectAreasSchema: yup.SchemaOf<TrbFormInputSubjectAreas> = yup.object(
  {
    subjectAreaTechnicalReferenceArchitecture: yup
      .array(
        yup
          .mixed()
          .oneOf<TRBTechnicalReferenceArchitectureOption>(
            Object.values(TRBTechnicalReferenceArchitectureOption)
          )
          .required()
      )
      .ensure(),
    subjectAreaNetworkAndSecurity: yup
      .array(
        yup
          .mixed()
          .oneOf<TRBNetworkAndSecurityOption>(
            Object.values(TRBNetworkAndSecurityOption)
          )
          .required()
      )
      .ensure(),
    subjectAreaCloudAndInfrastructure: yup
      .array(
        yup
          .mixed()
          .oneOf<TRBCloudAndInfrastructureOption>(
            Object.values(TRBCloudAndInfrastructureOption)
          )
          .required()
      )
      .ensure(),
    subjectAreaApplicationDevelopment: yup
      .array(
        yup
          .mixed()
          .oneOf<TRBApplicationDevelopmentOption>(
            Object.values(TRBApplicationDevelopmentOption)
          )
          .required()
      )
      .ensure(),
    subjectAreaDataAndDataManagement: yup
      .array(
        yup
          .mixed()
          .oneOf<TRBDataAndDataManagementOption>(
            Object.values(TRBDataAndDataManagementOption)
          )
          .required()
      )
      .ensure(),
    subjectAreaGovernmentProcessesAndPolicies: yup
      .array(
        yup
          .mixed()
          .oneOf<TRBGovernmentProcessesAndPoliciesOption>(
            Object.values(TRBGovernmentProcessesAndPoliciesOption)
          )
          .required()
      )
      .ensure(),
    subjectAreaOtherTechnicalTopics: yup
      .array(
        yup
          .mixed()
          .oneOf<TRBOtherTechnicalTopicsOption>(
            Object.values(TRBOtherTechnicalTopicsOption)
          )
          .required()
      )
      .ensure(),
    subjectAreaTechnicalReferenceArchitectureOther: yup
      .string()
      .when('subjectAreaTechnicalReferenceArchitecture', {
        is: (v: any) => Array.isArray(v) && v.includes('OTHER'),
        then: schema => schema.required()
      }),
    subjectAreaNetworkAndSecurityOther: yup
      .string()
      .when('subjectAreaNetworkAndSecurity', {
        is: (v: any) => Array.isArray(v) && v.includes('OTHER'),
        then: schema => schema.required()
      }),
    subjectAreaCloudAndInfrastructureOther: yup
      .string()
      .when('subjectAreaCloudAndInfrastructure', {
        is: (v: any) => Array.isArray(v) && v.includes('OTHER'),
        then: schema => schema.required()
      }),
    subjectAreaApplicationDevelopmentOther: yup
      .string()
      .when('subjectAreaApplicationDevelopment', {
        is: (v: any) => Array.isArray(v) && v.includes('OTHER'),
        then: schema => schema.required()
      }),
    subjectAreaDataAndDataManagementOther: yup
      .string()
      .when('subjectAreaDataAndDataManagement', {
        is: (v: any) => Array.isArray(v) && v.includes('OTHER'),
        then: schema => schema.required()
      }),
    subjectAreaGovernmentProcessesAndPoliciesOther: yup
      .string()
      .when('subjectAreaGovernmentProcessesAndPolicies', {
        is: (v: any) => Array.isArray(v) && v.includes('OTHER'),
        then: schema => schema.required()
      }),
    subjectAreaOtherTechnicalTopicsOther: yup
      .string()
      .when('subjectAreaOtherTechnicalTopics', {
        is: (v: any) => Array.isArray(v) && v.includes('OTHER'),
        then: schema => schema.required()
      })
  }
);

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

// Action schemas

export const trbFeedbackSchema = (feedbackAction: TRBFeedbackAction) =>
  yup.object({
    // Only mark feedbackMessage required for Request Edits action
    feedbackMessage:
      feedbackAction === TRBFeedbackAction.REQUEST_EDITS
        ? yup.string().required()
        : yup.string(),
    copyTrbMailbox: yup.boolean(),
    notifyEuaIds: yup.array(yup.string()).when('copyTrbMailbox', {
      is: (copyTrbMailbox: boolean) => !copyTrbMailbox,
      then: schema => schema.min(1),
      otherwise: schema => schema.optional()
    })
  });
