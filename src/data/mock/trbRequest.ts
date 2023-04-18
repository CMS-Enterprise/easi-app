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
  TRBRequestStatus,
  TRBRequestType
} from 'types/graphql-global-types';
import { TrbAdminTeamHomeRequest } from 'types/technicalAssistance';

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
  id: trbRequestId,
  name: 'TRB Request Mock',
  type: TRBRequestType.NEED_HELP,
  state: TRBRequestState.OPEN,
  trbLeadInfo: {
    __typename: 'UserInfo',
    commonName: ''
  },
  createdAt: '2023-01-05T07:26:16.036618Z',
  taskStatuses: {
    __typename: 'TRBTaskStatuses',
    attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
    consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
    feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
    formStatus: TRBFormStatus.READY_TO_START,
    adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET
  },
  adminNotes: [
    {
      __typename: 'TRBAdminNote',
      id: '123'
    }
  ]
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
      id: '682c9839-ac4c-48f5-8ac3-8693573e4dd8',
      title: 'Recommendation 1',
      recommendation: 'This is the recommendation text',
      links: ['easi.cms.gov', 'https://google.com']
    },
    {
      __typename: 'TRBAdviceLetterRecommendation',
      id: 'a118705f-c87b-48ef-a812-b3264ad00abe',
      title: 'Recommendation 2',
      recommendation: 'This is the recommendation text',
      links: ['easi.cms.gov', 'cms.gov']
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
    collabGRBConsultRequested: null,
    subjectAreaOptions: null,
    subjectAreaOptionOther: null,
    fundingSources: null,
    submittedAt: null,
    __typename: 'TRBRequestForm'
  },
  __typename: 'TRBRequest'
};

export const trbAdminTeamHomeRequests: TrbAdminTeamHomeRequest[] = [
  {
    id: '0ba435ac-50ee-44d1-94cc-4dd480b70a75',
    name: 'First help',
    type: TRBRequestType.NEED_HELP,
    isRecent: true,
    state: TRBRequestState.OPEN,
    status: TRBRequestStatus.NEW,
    consultMeetingTime: null,
    trbLeadComponent: null,
    trbLeadInfo: {
      commonName: '',
      __typename: 'UserInfo'
    },
    requesterComponent: null,
    requesterInfo: {
      commonName: 'Wava Upton',
      __typename: 'UserInfo'
    },
    taskStatuses: {
      attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
      consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
      feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
      formStatus: TRBFormStatus.READY_TO_START,
      adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET,
      __typename: 'TRBTaskStatuses'
    },
    form: {
      submittedAt: '2023-03-01T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    __typename: 'TRBRequest'
  },
  {
    id: '1ed1f39e-cfc3-47db-9837-4264dc1f8460',
    name: 'Second brainstorm',
    type: TRBRequestType.BRAINSTORM,
    isRecent: true,
    state: TRBRequestState.OPEN,
    status: TRBRequestStatus.NEW,
    consultMeetingTime: null,
    trbLeadComponent: null,
    trbLeadInfo: {
      commonName: '',
      __typename: 'UserInfo'
    },
    requesterComponent: null,
    requesterInfo: {
      commonName: 'Derick Koss',
      __typename: 'UserInfo'
    },
    taskStatuses: {
      attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
      consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
      feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
      formStatus: TRBFormStatus.READY_TO_START,
      adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET,
      __typename: 'TRBTaskStatuses'
    },
    form: {
      submittedAt: '2023-03-02T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    __typename: 'TRBRequest'
  },
  {
    id: 'dfb9739e-bd4d-11ed-ae6c-7a788b7686d3',
    name: 'Third open',
    type: TRBRequestType.NEED_HELP,
    isRecent: false,
    state: TRBRequestState.OPEN,
    status: TRBRequestStatus.DRAFT_REQUEST_FORM,
    consultMeetingTime: null,
    trbLeadComponent: null,
    trbLeadInfo: {
      commonName: 'Astrid Howell',
      __typename: 'UserInfo'
    },
    requesterComponent: null,
    requesterInfo: {
      commonName: 'Loraine Kirlin',
      __typename: 'UserInfo'
    },
    taskStatuses: {
      attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
      consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
      feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
      formStatus: TRBFormStatus.READY_TO_START,
      adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET,
      __typename: 'TRBTaskStatuses'
    },
    form: {
      submittedAt: '2023-03-03T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    __typename: 'TRBRequest'
  },
  {
    id: '143a7374-bd4f-11ed-a56b-7a788b7686d3',
    name: 'Fourth open with date',
    type: TRBRequestType.NEED_HELP,
    isRecent: false,
    state: TRBRequestState.OPEN,
    status: TRBRequestStatus.REQUEST_FORM_COMPLETE,
    consultMeetingTime: '2023-04-01T09:23:45Z',
    trbLeadComponent: null,
    trbLeadInfo: {
      commonName: 'Polly Sauer',
      __typename: 'UserInfo'
    },
    requesterComponent: null,
    requesterInfo: {
      commonName: 'Clotilde Goodwin',
      __typename: 'UserInfo'
    },
    taskStatuses: {
      attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
      consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
      feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
      formStatus: TRBFormStatus.READY_TO_START,
      adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET,
      __typename: 'TRBTaskStatuses'
    },
    form: {
      submittedAt: '2023-03-04T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    __typename: 'TRBRequest'
  },
  {
    id: 'ef230178-bd4e-11ed-b9b4-7a788b7686d3',
    name: 'Fifth closed',
    type: TRBRequestType.NEED_HELP,
    isRecent: false,
    state: TRBRequestState.CLOSED,
    status: TRBRequestStatus.READY_FOR_CONSULT,
    consultMeetingTime: '2023-04-02T09:23:45Z',
    trbLeadComponent: null,
    trbLeadInfo: {
      commonName: 'Sydni Reynolds',
      __typename: 'UserInfo'
    },
    requesterComponent: null,
    requesterInfo: {
      commonName: 'Sylvester Mante',
      __typename: 'UserInfo'
    },
    taskStatuses: {
      attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
      consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
      feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
      formStatus: TRBFormStatus.READY_TO_START,
      adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET,
      __typename: 'TRBTaskStatuses'
    },
    form: {
      submittedAt: '2023-03-05T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    __typename: 'TRBRequest'
  },
  {
    id: '243f22b4-bd50-11ed-8714-7a788b7686d3',
    name: 'Sixth open with component',
    type: TRBRequestType.NEED_HELP,
    isRecent: false,
    state: TRBRequestState.OPEN,
    status: TRBRequestStatus.CONSULT_SCHEDULED,
    consultMeetingTime: '2023-04-02T09:23:45Z',
    trbLeadComponent: 'TRB',
    trbLeadInfo: {
      commonName: 'Hosea Lemke',
      __typename: 'UserInfo'
    },
    requesterComponent: 'BBQ',
    requesterInfo: {
      commonName: 'Damaris Langosh',
      __typename: 'UserInfo'
    },
    taskStatuses: {
      attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
      consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
      feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
      formStatus: TRBFormStatus.READY_TO_START,
      adviceLetterStatus: TRBAdviceLetterStatus.CANNOT_START_YET,
      __typename: 'TRBTaskStatuses'
    },
    form: {
      submittedAt: '2023-03-06T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    __typename: 'TRBRequest'
  }
];
