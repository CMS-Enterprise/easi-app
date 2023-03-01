import { GetTrbAdviceLetter_trbRequest_adviceLetter as AdviceLetter } from 'queries/types/GetTrbAdviceLetter';
import { GetTrbRequest_trbRequest as TrbRequest } from 'queries/types/GetTrbRequest';
import { GetTRBRequestAttendees_trbRequest_attendees as TRBAttendee } from 'queries/types/GetTRBRequestAttendees';
import { GetTrbRequestSummary_trbRequest as Summary } from 'queries/types/GetTrbRequestSummary';
import {
  PersonRole,
  TRBAdviceLetterStatus,
  TRBAttendConsultStatus,
  TRBConsultPrepStatus,
  TRBFeedbackStatus,
  TRBFormStatus,
  TRBRequestState,
  TRBRequestType
} from 'types/graphql-global-types';

const trbRequestId: string = '441cb9e0-2cb3-43ca-b168-9d6a2a13ec91';

const euaUserId: string = 'ABCD';

export const requester: TRBAttendee = {
  __typename: 'TRBRequestAttendee',
  id: '330459da-b5d0-4265-b290-137c1273a0bc',
  trbRequestId,
  userInfo: {
    __typename: 'UserInfo',
    commonName: 'Adeline Aarons',
    euaUserId,
    email: 'adeline.aarons@local.fake'
  },
  component: 'CMS Wide',
  role: PersonRole.PRODUCT_OWNER,
  createdAt: '2023-01-05T07:26:16.036618Z'
};

export const attendees: TRBAttendee[] = [
  {
    __typename: 'TRBRequestAttendee',
    id: '9a6a3b4e-1a46-4a07-9e0e-e10f8aaf4f82',
    trbRequestId,
    userInfo: {
      __typename: 'UserInfo',
      commonName: 'Anabelle Jerde',
      email: 'anabelle.jerde@local.fake',
      euaUserId: 'JTTC'
    },
    component: 'Center for Program Integrity',
    role: PersonRole.PRIVACY_ADVISOR,
    createdAt: '2023-01-05T07:26:16.036618Z'
  },
  {
    __typename: 'TRBRequestAttendee',
    id: '91a14322-34a8-4838-bde3-17b1d483fb63',
    trbRequestId,
    userInfo: {
      __typename: 'UserInfo',
      commonName: 'Jerry Seinfeld',
      email: 'jerry.seinfeld@local.fake',
      euaUserId: 'SF13'
    },
    component: 'Office of Equal Opportunity and Civil Rights',
    role: PersonRole.PRODUCT_OWNER,
    createdAt: '2023-01-05T07:26:16.036618Z'
  },
  {
    __typename: 'TRBRequestAttendee',
    id: 'a86ca9bb-518a-4669-9ce9-fd7f79f8262a',
    trbRequestId,
    userInfo: {
      __typename: 'UserInfo',
      commonName: 'Audrey Abrams',
      email: 'audrey.abrams@local.fake',
      euaUserId: 'ADMI'
    },
    component: 'CMS Wide',
    role: PersonRole.SYSTEM_OWNER,
    createdAt: '2023-01-05T07:26:16.036618Z'
  }
];

export const trbRequestSummary: Summary = {
  __typename: 'TRBRequest',
  name: 'TRB Request Mock',
  type: TRBRequestType.NEED_HELP,
  state: TRBRequestState.OPEN,
  trbLead: null,
  createdAt: '2023-01-05T07:26:16.036618Z',
  taskStatuses: {
    __typename: 'TRBTaskStatuses',
    attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
    consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
    feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
    formStatus: TRBFormStatus.READY_TO_START,
    adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET
  }
};

export const trbRequestAdviceLetter: AdviceLetter = {
  __typename: 'TRBAdviceLetter',
  id: '1b68aeca-f0d4-42e8-90ef-70ed2de1a34b',
  meetingSummary: 'Meeting summary text',
  nextSteps: 'These are the next steps',
  isFollowupRecommended: true,
  dateSent: null,
  followupPoint: 'Six months from now',
  recommendations: [
    {
      __typename: 'TRBAdviceLetterRecommendation',
      title: 'Recommendation 1',
      recommendation: 'This is the recommendation text',
      links: ['easi.cms.gov', 'https://google.com']
    }
  ],
  author: {
    __typename: 'UserInfo',
    euaUserId: 'SF13',
    commonName: 'Jerry Seinfeld'
  },
  createdAt: '2023-01-05T07:26:16.036618Z',
  modifiedAt: null
};

export const trbRequest: TrbRequest = {
  id: trbRequestId,
  name: 'Draft',
  taskStatuses: {
    __typename: 'TRBTaskStatuses',
    attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
    consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
    feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
    formStatus: TRBFormStatus.READY_TO_START,
    adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET
  },
  feedback: [],
  state: TRBRequestState.OPEN,
  type: TRBRequestType.NEED_HELP,
  form: {
    id: '452cf444-69b2-41a9-b8ab-ed354d209307',
    component: null,
    needsAssistanceWith: null,
    hasSolutionInMind: null,
    proposedSolution: null,
    whereInProcess: null,
    whereInProcessOther: null,
    hasExpectedStartEndDates: null,
    expectedStartDate: null,
    expectedEndDate: null,
    collabGroups: [],
    collabDateSecurity: null,
    collabDateEnterpriseArchitecture: null,
    collabDateCloud: null,
    collabDatePrivacyAdvisor: null,
    collabDateGovernanceReviewBoard: null,
    collabDateOther: null,
    collabGroupOther: null,
    subjectAreaTechnicalReferenceArchitecture: [],
    subjectAreaNetworkAndSecurity: [],
    subjectAreaCloudAndInfrastructure: [],
    subjectAreaApplicationDevelopment: [],
    subjectAreaDataAndDataManagement: [],
    subjectAreaGovernmentProcessesAndPolicies: [],
    subjectAreaOtherTechnicalTopics: [],
    subjectAreaTechnicalReferenceArchitectureOther: null,
    subjectAreaNetworkAndSecurityOther: null,
    subjectAreaCloudAndInfrastructureOther: null,
    subjectAreaApplicationDevelopmentOther: null,
    subjectAreaDataAndDataManagementOther: null,
    subjectAreaGovernmentProcessesAndPoliciesOther: null,
    subjectAreaOtherTechnicalTopicsOther: null,
    submittedAt: null,
    __typename: 'TRBRequestForm'
  },
  __typename: 'TRBRequest'
};
