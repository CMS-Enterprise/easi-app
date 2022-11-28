import * as yup from 'yup';

import {
  PersonRole,
  TRBCollabGroupOption,
  TRBWhereInProcessOption,
  UpdateTRBRequestFormInput
} from 'types/graphql-global-types';

type NonNullableProps<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type TrbFormInputBasic = NonNullableProps<
  Pick<
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
  >
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
  hasExpectedStartEndDates: yup.boolean().nullable().required(),
  expectedStartDate: yup.string().when('hasExpectedStartEndDates', {
    is: true,
    then: schema => schema.required()
  }),
  expectedEndDate: yup.string().when('hasExpectedStartEndDates', {
    is: true,
    then: schema => schema.required()
  }),
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

export const trbAttendeeSchema = yup.object({
  euaUserId: yup.string().required('Attendee name is a required field'),
  component: yup.string().required('Attendee component is a required field'),
  role: yup
    .mixed<PersonRole>()
    .oneOf(Object.values(PersonRole))
    .required('Attendee role is a required field')
});
