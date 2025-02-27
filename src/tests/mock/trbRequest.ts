import {
  GetRequestsDocument,
  GetRequestsQuery,
  GetTRBAdminHomeDocument,
  GetTRBAdminHomeQuery,
  GetTRBAdminNotesDocument,
  GetTRBAdminNotesQuery,
  GetTRBAdminNotesQueryVariables,
  GetTRBGuidanceLetterDocument,
  GetTRBGuidanceLetterInsightsDocument,
  GetTRBGuidanceLetterInsightsQuery,
  GetTRBGuidanceLetterInsightsQueryVariables,
  GetTRBGuidanceLetterQuery,
  GetTRBGuidanceLetterQueryVariables,
  GetTRBLeadOptionsDocument,
  GetTRBLeadOptionsQuery,
  GetTRBRequestAttendeesDocument,
  GetTRBRequestAttendeesQuery,
  GetTRBRequestDocument,
  GetTRBRequestDocumentsDocument,
  GetTRBRequestDocumentsQuery,
  GetTRBRequestDocumentsQueryVariables,
  GetTRBRequestQuery,
  GetTRBRequestQueryVariables,
  GetTRBRequestSummaryDocument,
  GetTRBRequestSummaryQuery,
  PersonRole,
  TRBAdminNoteCategory,
  TRBAdminNoteFragment,
  TRBGuidanceLetterFragment,
  TRBGuidanceLetterInsightCategory,
  UpdateTRBRequestConsultMeetingDocument,
  UpdateTRBRequestConsultMeetingMutation,
  UpdateTRBRequestConsultMeetingMutationVariables
} from 'gql/generated/graphql';
import { TrbRequestFormFields_taskStatuses as TaskStatuses } from 'gql/legacyGQL/types/TrbRequestFormFields';

import {
  TRBAttendConsultStatus,
  TRBCollabGroupOption,
  TRBConsultPrepStatus,
  TRBFeedbackStatus,
  TRBFormStatus,
  TRBGuidanceLetterStatus,
  TRBRequestState,
  TRBRequestStatus,
  TRBRequestType,
  TRBWhereInProcessOption
} from 'types/graphql-global-types';
import { MockedQuery } from 'types/util';
import MockTrbAttendees, {
  MockTrbAttendee,
  mockTrbRequestId
} from 'utils/testing/MockTrbAttendees';

import { MockUserInfo } from './users';

const trbRequestId = mockTrbRequestId;
const users = new MockTrbAttendees({ trbRequestId });

export const requester: MockTrbAttendee = users.findByEuaUserId('ABCD')!;
export const attendees: MockTrbAttendee[] = [
  users.next({
    role: PersonRole.CLOUD_NAVIGATOR,
    component: 'Center for Clinical Standards and Quality'
  })!,
  users.next({
    role: PersonRole.PRIVACY_ADVISOR,
    component: 'Center for Medicare'
  })!,
  users.next({
    role: PersonRole.SYSTEM_MAINTAINER,
    component: 'Center for Program Integrity'
  })!
];

export const newAttendee: MockTrbAttendee = users.next({
  role: PersonRole.CRA,
  component: 'Center for Clinical Standards and Quality'
})!;

export const taskStatuses: TaskStatuses = {
  __typename: 'TRBTaskStatuses',
  formStatus: TRBFormStatus.IN_PROGRESS,
  feedbackStatus: TRBFeedbackStatus.CANNOT_START_YET,
  consultPrepStatus: TRBConsultPrepStatus.CANNOT_START_YET,
  attendConsultStatus: TRBAttendConsultStatus.CANNOT_START_YET,
  guidanceLetterStatus: TRBGuidanceLetterStatus.CANNOT_START_YET
};

const adminNotes: TRBAdminNoteFragment[] = [
  {
    __typename: 'TRBAdminNote',
    id: '861fa6c5-c9af-4cda-a559-0995b7b76855',
    isArchived: false,
    category: TRBAdminNoteCategory.GENERAL_REQUEST,
    noteText: 'My cute note',
    author: {
      __typename: 'UserInfo',
      commonName: requester.userInfo.commonName
    },
    createdAt: '2024-03-28T13:20:37.852099Z',
    categorySpecificData: {
      __typename: 'TRBAdminNoteGeneralRequestCategoryData'
    }
  }
];

export const trbRequest: GetTRBRequestQuery['trbRequest'] = {
  __typename: 'TRBRequest',
  id: trbRequestId,
  name: 'Mock TRB Request',
  type: TRBRequestType.NEED_HELP,
  state: TRBRequestState.OPEN,
  taskStatuses,
  feedback: [],
  form: {
    id: '452cf444-69b2-41a9-b8ab-ed354d209307',
    component: 'Center for Medicaid and CHIP Services',
    needsAssistanceWith: 'x',
    hasSolutionInMind: false,
    proposedSolution: null,
    whereInProcess:
      TRBWhereInProcessOption.I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM,
    whereInProcessOther: null,
    hasExpectedStartEndDates: false,
    expectedStartDate: null,
    expectedEndDate: null,
    systemIntakes: [],
    collabGroups: [TRBCollabGroupOption.ENTERPRISE_ARCHITECTURE],
    collabDateSecurity: null,
    collabDateEnterpriseArchitecture: 'x',
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
  relatedTRBRequests: [],
  relatedIntakes: []
};

export const getTrbRequestQuery: MockedQuery<
  GetTRBRequestQuery,
  GetTRBRequestQueryVariables
> = {
  request: {
    query: GetTRBRequestDocument,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: {
      __typename: 'Query',
      trbRequest
    }
  }
};

export const trbRequestSummary: GetTRBRequestSummaryQuery['trbRequest'] = {
  __typename: 'TRBRequest',
  id: trbRequestId,
  name: 'Mock TRB Request',
  type: TRBRequestType.NEED_HELP,
  state: TRBRequestState.OPEN,
  status: TRBRequestStatus.DRAFT_REQUEST_FORM,
  trbLeadInfo: {
    __typename: 'UserInfo',
    commonName: ''
  },
  createdAt: '2023-01-05T07:26:16.036618Z',
  taskStatuses,
  adminNotes,
  relationType: null,
  contractName: 'A great service',
  contractNumbers: [
    {
      __typename: 'TRBRequestContractNumber',
      id: '789',
      contractNumber: '123124455432'
    }
  ],
  systems: [
    {
      __typename: 'CedarSystem',
      id: '123',
      name: 'My system',
      description: 'A fun system',
      acronym: 'MS',
      businessOwnerOrg: 'Oddball',
      businessOwnerRoles: [
        {
          __typename: 'CedarRole',
          objectID: '9787620',
          assigneeFirstName: 'John',
          assigneeLastName: 'Doe'
        }
      ]
    }
  ]
};

export const getTrbRequestSummary = (
  fields:
    | {
        taskStatuses?: Partial<TaskStatuses>;
        status?: TRBRequestStatus;
      }
    | undefined
): GetTRBRequestSummaryQuery['trbRequest'] => ({
  ...trbRequestSummary,
  status: fields?.status || TRBRequestStatus.DRAFT_REQUEST_FORM,
  taskStatuses: {
    ...taskStatuses,
    ...fields?.taskStatuses
  }
});

export const getTrbRequestSummaryQuery: MockedQuery<GetTRBRequestSummaryQuery> =
  {
    request: {
      query: GetTRBRequestSummaryDocument,
      variables: {
        id: trbRequestId
      }
    },
    result: {
      data: {
        __typename: 'Query',
        trbRequest: trbRequestSummary
      }
    }
  };

const getRequestsData: {
  myTrbRequests: MyTrbRequests[];
} = {
  myTrbRequests: [
    {
      id: '1afc9242-f244-47a3-9f91-4d6fedd8eb91',
      name: 'My excellent question',
      nextMeetingDate: null,
      status: TRBRequestStatus.CONSULT_COMPLETE,
      submittedAt: '2023-03-07T15:09:17.694681Z',
      __typename: 'TRBRequest',
      systems: [],
      lastMeetingDate: null
    }
  ]
};

type MyTrbRequests = GetRequestsQuery['myTrbRequests'][number];

export const getRequestsQuery = (
  myTrbRequests: MyTrbRequests[] = getRequestsData.myTrbRequests
): MockedQuery<GetRequestsQuery> => ({
  request: {
    query: GetRequestsDocument,
    variables: {}
  },
  result: {
    data: {
      __typename: 'Query',
      myTrbRequests,
      mySystemIntakes: []
    }
  }
});

export const getTRBRequestAttendeesQuery: MockedQuery<GetTRBRequestAttendeesQuery> =
  {
    request: {
      query: GetTRBRequestAttendeesDocument,
      variables: {
        id: trbRequestId
      }
    },
    result: {
      data: {
        __typename: 'Query',
        trbRequest: {
          __typename: 'TRBRequest',
          id: trbRequestId,
          attendees: [requester, ...attendees]
        }
      }
    }
  };

export const updateTrbRequestConsultMeetingQuery: MockedQuery<
  UpdateTRBRequestConsultMeetingMutation,
  UpdateTRBRequestConsultMeetingMutationVariables
> = {
  request: {
    query: UpdateTRBRequestConsultMeetingDocument,
    variables: {
      input: {
        trbRequestId,
        consultMeetingTime: '2023-02-23T13:00:00.000Z',
        notes: '',
        copyTrbMailbox: true,
        notifyEuaIds: [requester.userInfo.euaUserId]
      }
    }
  },
  result: {
    data: {
      __typename: 'Mutation',
      updateTRBRequestConsultMeetingTime: {
        __typename: 'TRBRequest',
        id: trbRequestId,
        consultMeetingTime: '2023-02-23T13:00:00.000Z'
      }
    }
  }
};

export const guidanceLetter: NonNullable<TRBGuidanceLetterFragment> = {
  __typename: 'TRBGuidanceLetter',
  id: '1b68aeca-f0d4-42e8-90ef-70ed2de1a34b',
  meetingSummary: 'Meeting summary text',
  nextSteps: 'These are the next steps',
  isFollowupRecommended: true,
  dateSent: null,
  followupPoint: 'Six months from now',
  insights: [
    {
      __typename: 'TRBGuidanceLetterInsight',
      category: TRBGuidanceLetterInsightCategory.RECOMMENDATION,
      id: '682c9839-ac4c-48f5-8ac3-8693573e4dd8',
      title: 'Insight 1',
      insight: 'This is the insight text',
      links: ['easi.cms.gov', 'https://google.com']
    },
    {
      __typename: 'TRBGuidanceLetterInsight',
      category: TRBGuidanceLetterInsightCategory.RECOMMENDATION,
      id: 'a118705f-c87b-48ef-a812-b3264ad00abe',
      title: 'Insight 2',
      insight: 'This is the insight text',
      links: ['easi.cms.gov', 'cms.gov']
    },
    {
      __typename: 'TRBGuidanceLetterInsight',
      category: TRBGuidanceLetterInsightCategory.RECOMMENDATION,
      id: 'e73fefbd-0d1a-4345-a217-2ce1ebe64d4f',
      title: 'Insight 3',
      insight: 'This is the insight text',
      links: []
    }
  ],
  author: {
    __typename: 'UserInfo',
    euaUserId: attendees[0].userInfo.euaUserId,
    commonName: attendees[0].userInfo.commonName
  },
  createdAt: '2023-01-08T07:26:16.036618Z',
  modifiedAt: null
};

export const getTrbGuidanceLetterQuery: MockedQuery<
  GetTRBGuidanceLetterQuery,
  GetTRBGuidanceLetterQueryVariables
> = {
  request: {
    query: GetTRBGuidanceLetterDocument,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: {
      __typename: 'Query',
      trbRequest: {
        __typename: 'TRBRequest',
        id: trbRequestId,
        name: trbRequest.name,
        type: TRBRequestType.NEED_HELP,
        createdAt: '2023-01-08T07:26:16.036618Z',
        consultMeetingTime: null,
        taskStatuses: {
          __typename: 'TRBTaskStatuses',
          guidanceLetterStatus: TRBGuidanceLetterStatus.COMPLETED
        },
        guidanceLetter
      }
    }
  }
};

export const getTRBGuidanceLetterInsightsQuery: MockedQuery<
  GetTRBGuidanceLetterInsightsQuery,
  GetTRBGuidanceLetterInsightsQueryVariables
> = {
  request: {
    query: GetTRBGuidanceLetterInsightsDocument,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: {
      __typename: 'Query',
      trbRequest: {
        __typename: 'TRBRequest',
        guidanceLetter: {
          __typename: 'TRBGuidanceLetter',
          insights: guidanceLetter.insights
        }
      }
    }
  }
};

export const getTrbAdminNotesQuery = (
  notes: TRBAdminNoteFragment[] = adminNotes
): MockedQuery<GetTRBAdminNotesQuery, GetTRBAdminNotesQueryVariables> => ({
  request: {
    query: GetTRBAdminNotesDocument,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: {
      __typename: 'Query',
      trbRequest: {
        __typename: 'TRBRequest',
        id: trbRequestId,
        adminNotes: notes
      }
    }
  }
});

export const trbAdminTeamHomeRequests: GetTRBAdminHomeQuery['trbRequests'] = [
  {
    id: '0ba435ac-50ee-44d1-94cc-4dd480b70a75',
    name: 'First help',
    type: TRBRequestType.NEED_HELP,
    isRecent: true,
    state: TRBRequestState.OPEN,
    status: TRBRequestStatus.NEW,
    consultMeetingTime: null,
    trbLeadInfo: {
      commonName: '',
      __typename: 'UserInfo'
    },
    requesterComponent: null,
    requesterInfo: {
      commonName: users.next()?.userInfo.commonName!,
      __typename: 'UserInfo'
    },
    taskStatuses,
    form: {
      submittedAt: '2023-03-01T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    contractName: 'Word',
    contractNumbers: [
      {
        contractNumber: '24',
        __typename: 'TRBRequestContractNumber'
      },
      {
        contractNumber: '13',
        __typename: 'TRBRequestContractNumber'
      }
    ],
    systems: [
      { id: '{0}', name: 'Quality team', __typename: 'CedarSystem' },
      { id: '{0}', name: 'Management service', __typename: 'CedarSystem' }
    ],
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
    trbLeadInfo: {
      commonName: '',
      __typename: 'UserInfo'
    },
    requesterComponent: null,
    requesterInfo: {
      commonName: users.next()?.userInfo.commonName!,
      __typename: 'UserInfo'
    },
    taskStatuses,
    form: {
      submittedAt: '2023-03-02T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    contractName: '',
    contractNumbers: [],
    systems: [],
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
    trbLeadInfo: {
      commonName: users.next()?.userInfo.commonName!,
      __typename: 'UserInfo'
    },
    requesterComponent: null,
    requesterInfo: {
      commonName: users.next()?.userInfo.commonName!,
      __typename: 'UserInfo'
    },
    taskStatuses,
    form: {
      submittedAt: '2023-03-03T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    contractName: '',
    contractNumbers: [],
    systems: [],
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
    trbLeadInfo: {
      commonName: users.next()?.userInfo.commonName!,
      __typename: 'UserInfo'
    },
    requesterComponent: null,
    requesterInfo: {
      commonName: users.next()?.userInfo.commonName!,
      __typename: 'UserInfo'
    },
    taskStatuses,
    form: {
      submittedAt: '2023-03-04T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    contractName: '',
    contractNumbers: [],
    systems: [],
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
    trbLeadInfo: {
      commonName: users.next()?.userInfo.commonName!,
      __typename: 'UserInfo'
    },
    requesterComponent: null,
    requesterInfo: {
      commonName: users.next()?.userInfo.commonName!,
      __typename: 'UserInfo'
    },
    taskStatuses,
    form: {
      submittedAt: '2023-03-05T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    contractName: '',
    contractNumbers: [],
    systems: [],
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
    trbLeadInfo: {
      commonName: users.next()?.userInfo.commonName!,
      __typename: 'UserInfo'
    },
    requesterComponent: 'CMS Wide',
    requesterInfo: {
      commonName: users.next()?.userInfo.commonName!,
      __typename: 'UserInfo'
    },
    taskStatuses,
    form: {
      submittedAt: '2023-03-06T01:23:45Z',
      __typename: 'TRBRequestForm'
    },
    contractName: '',
    contractNumbers: [],
    systems: [],
    __typename: 'TRBRequest'
  }
];

export const getTrbAdminTeamHomeQuery: MockedQuery<GetTRBAdminHomeQuery> = {
  request: { query: GetTRBAdminHomeDocument, variables: {} },
  result: {
    data: {
      __typename: 'Query',
      trbRequests: [...trbAdminTeamHomeRequests]
    }
  }
};

export const trbLeadOptions: MockUserInfo[] = [
  users.next()?.userInfo!,
  users.next()?.userInfo!,
  users.next()?.userInfo!
];

export const getTrbLeadOptionsQuery: MockedQuery<GetTRBLeadOptionsQuery> = {
  request: {
    query: GetTRBLeadOptionsDocument,
    variables: {}
  },
  result: {
    data: {
      __typename: 'Query',
      trbLeadOptions
    }
  }
};

export const getTrbRequestDocumentsQuery: MockedQuery<
  GetTRBRequestDocumentsQuery,
  GetTRBRequestDocumentsQueryVariables
> = {
  request: {
    query: GetTRBRequestDocumentsDocument,
    variables: { id: trbRequestId }
  },
  result: {
    data: {
      __typename: 'Query',
      trbRequest: {
        __typename: 'TRBRequest',
        id: trbRequestId,
        documents: []
      }
    }
  }
};
