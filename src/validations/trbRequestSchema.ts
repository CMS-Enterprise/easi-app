import * as yup from 'yup';

import {
  TRBApplicationDevelopmentOption,
  TRBCloudAndInfrastructureOption,
  TRBCollabGroupOption,
  TRBDataAndDataManagementOption,
  TRBGovernmentProcessesAndPoliciesOption,
  TRBNetworkAndSecurityOption,
  TRBOtherTechnicalTopicsOption,
  TRBTechnicalReferenceArchitectureOption,
  TRBWhereInProcessOption,
  UpdateTRBRequestFormInput
} from 'types/graphql-global-types';

type TrbFormInputBasic = Pick<
  UpdateTRBRequestFormInput,
  | 'component'
  | 'needsAssistanceWith'
  | 'hasSolutionInMind'
  | 'proposedSolution'
  | 'whereInProcess'
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
