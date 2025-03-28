import {
  GetGovernanceTaskListDocument,
  GetGovernanceTaskListQuery,
  GetGovernanceTaskListQueryVariables,
  GetSystemIntakeContactsDocument,
  GetSystemIntakeContactsQuery,
  GetSystemIntakeDocument,
  GetSystemIntakeQuery,
  GetSystemIntakeQueryVariables,
  GetSystemIntakesTableQuery,
  GetSystemIntakesWithLCIDSDocument,
  GetSystemIntakesWithLCIDSQuery,
  GovernanceRequestFeedbackTargetForm,
  GovernanceRequestFeedbackType,
  GRBVotingInformationStatus,
  ITGovDecisionStatus,
  ITGovDraftBusinessCaseStatus,
  ITGovFeedbackStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovGRBStatus,
  ITGovGRTStatus,
  ITGovIntakeFormStatus,
  SystemIntakeContact,
  SystemIntakeDecisionState,
  SystemIntakeDocumentCommonType,
  SystemIntakeDocumentFragmentFragment,
  SystemIntakeDocumentStatus,
  SystemIntakeDocumentVersion,
  SystemIntakeFormState,
  SystemIntakeFragmentFragment,
  SystemIntakeGRBPresentationLinksFragmentFragment,
  SystemIntakeGRBReviewType,
  SystemIntakeRequestType,
  SystemIntakeState,
  SystemIntakeStatusAdmin,
  SystemIntakeStatusRequester,
  SystemIntakeStep,
  SystemIntakeTRBFollowUp,
  SystemIntakeWithReviewRequestedFragment,
  TRBRequestStatus
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';

import { CMSOffice } from 'constants/enums/cmsDivisionsAndOffices';
import { MockedQuery } from 'types/util';

import users from './users';

type ContactRole =
  | 'Requester'
  | 'Business Owner'
  | 'Product Manager'
  | 'ISSO'
  | 'Product Owner'
  | 'System Owner'
  | 'System Maintainer'
  | 'Contracting Officer’s Representative (COR)'
  | 'Cloud Navigator'
  | 'Privacy Advisor'
  | 'CRA'
  | 'Other';

export interface MockSystemIntakeContact extends SystemIntakeContact {
  component: CMSOffice;
  role: ContactRole;
  commonName: string;
  email: string;
}

const systemIntakeId = 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2';

const contacts: MockSystemIntakeContact[] = users.slice(0, 4).map(userInfo => ({
  __typename: 'SystemIntakeContact',
  systemIntakeId,
  id: `systemIntakeContact-${userInfo.euaUserId}`,
  euaUserId: userInfo.euaUserId,
  commonName: userInfo.commonName,
  email: userInfo.email,
  component: 'CMS Wide',
  role: 'Other'
}));

export const requester: MockSystemIntakeContact = {
  ...contacts[0],
  role: 'Requester'
};

const businessOwner: MockSystemIntakeContact = {
  ...contacts[1],
  role: 'Business Owner',
  component: 'Center for Medicare'
};

export const productManager: MockSystemIntakeContact = {
  ...contacts[2],
  role: 'Product Manager',
  component: 'Office of Legislation'
};

const isso: MockSystemIntakeContact = {
  ...contacts[3],
  role: 'ISSO',
  component: 'Office of Communications'
};

export const documents: SystemIntakeDocumentFragmentFragment[] = [
  {
    id: '3b23fcf9-85d3-4211-a7d8-d2d08148f196',
    fileName: 'sample1.pdf',
    documentType: {
      commonType: SystemIntakeDocumentCommonType.DRAFT_IGCE,
      otherTypeDescription: null,
      __typename: 'SystemIntakeDocumentType'
    },
    version: SystemIntakeDocumentVersion.CURRENT,
    status: SystemIntakeDocumentStatus.AVAILABLE,
    uploadedAt: '2023-06-14T18:24:46.310929Z',
    url: 'http://localhost:9004/easi-app-file-uploads/ead3f487-8aaa-47d2-aa26-335e9b560a92.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=f71d5d63d68958a2bd8526c2b2cdd5abe78b21eb69d10739fe8f8e6fd5d010ec',
    canView: true,
    canDelete: true,
    systemIntakeId,
    __typename: 'SystemIntakeDocument'
  },
  {
    id: '8cd01e45-810d-445d-b702-b31b8e1b1f14',
    fileName: 'sample2.pdf',
    documentType: {
      commonType: SystemIntakeDocumentCommonType.SOO_SOW,
      otherTypeDescription: null,
      __typename: 'SystemIntakeDocumentType'
    },
    version: SystemIntakeDocumentVersion.CURRENT,
    status: SystemIntakeDocumentStatus.PENDING,
    uploadedAt: '2023-06-14T18:24:46.32661Z',
    url: 'http://localhost:9004/easi-app-file-uploads/7e047111-6228-4943-9c4b-0961f27858f4.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=0e3f337697c616b01533accd95a316cbeabeb6990961b9881911c757837cbf95',
    canView: true,
    canDelete: true,
    systemIntakeId,
    __typename: 'SystemIntakeDocument'
  },
  {
    id: 'f7138102-c9aa-4215-a331-6ee9aedf5ef3',
    fileName: 'sample3.pdf',
    documentType: {
      commonType: SystemIntakeDocumentCommonType.OTHER,
      otherTypeDescription: 'Some other type of doc',
      __typename: 'SystemIntakeDocumentType'
    },
    version: SystemIntakeDocumentVersion.HISTORICAL,
    status: SystemIntakeDocumentStatus.UNAVAILABLE,
    uploadedAt: '2023-06-14T18:24:46.342866Z',
    url: 'http://localhost:9004/easi-app-file-uploads/f779e8e4-9c78-4b14-bbab-37618447f3f9.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=7e6755645a1f163d41d2fa7c19776d0ceb4cfd3ff8e1c2918c428a551fe44764',
    canView: true,
    canDelete: true,
    systemIntakeId,
    __typename: 'SystemIntakeDocument'
  }
];

export const grbPresentationLinks: SystemIntakeGRBPresentationLinksFragmentFragment =
  {
    __typename: 'SystemIntakeGRBPresentationLinks',
    recordingLink: 'https://google.com',
    recordingPasscode: '123456',
    transcriptFileName: 'transcript.doc',
    transcriptFileStatus: SystemIntakeDocumentStatus.AVAILABLE,
    transcriptFileURL: 'https://google.com',
    transcriptLink: null,
    presentationDeckFileName: 'presentationDeck.pptx',
    presentationDeckFileStatus: SystemIntakeDocumentStatus.AVAILABLE,
    presentationDeckFileURL: 'https://google.com'
  };

export const governanceRequestFeedbacks: SystemIntakeFragmentFragment['governanceRequestFeedbacks'] =
  [
    {
      id: '401c5caa-2245-4078-aa8d-670e72d6020d',
      feedback:
        'grb recommendations for DRAFT_BUSINESS_CASE progressing to GRT_MEETING',
      targetForm: GovernanceRequestFeedbackTargetForm.NO_TARGET_PROVIDED,
      type: GovernanceRequestFeedbackType.GRB,
      author: {
        commonName: 'User One',
        __typename: 'UserInfo'
      },
      createdAt: '2025-01-17T23:06:47.48853Z',
      __typename: 'GovernanceRequestFeedback'
    },
    {
      id: '06f198f0-9752-403a-a188-101cf84e7f38',
      feedback: 'feedback for DRAFT_BUSINESS_CASE progressing to GRT_MEETING',
      targetForm: GovernanceRequestFeedbackTargetForm.NO_TARGET_PROVIDED,
      type: GovernanceRequestFeedbackType.REQUESTER,
      author: {
        commonName: 'User One',
        __typename: 'UserInfo'
      },
      createdAt: '2025-01-17T23:06:47.484384Z',
      __typename: 'GovernanceRequestFeedback'
    },
    {
      id: '81e49d6c-17c0-443d-b3de-226f7244b1a1',
      feedback:
        'grb recommendations for INITIAL_REQUEST_FORM progressing to DRAFT_BUSINESS_CASE',
      targetForm: GovernanceRequestFeedbackTargetForm.NO_TARGET_PROVIDED,
      type: GovernanceRequestFeedbackType.GRB,
      author: {
        commonName: 'User One',
        __typename: 'UserInfo'
      },
      createdAt: '2025-01-17T23:06:47.473107Z',
      __typename: 'GovernanceRequestFeedback'
    },
    {
      id: '1a4c9577-7573-4a39-b8ee-240db0b35476',
      feedback:
        'feedback for INITIAL_REQUEST_FORM progressing to DRAFT_BUSINESS_CASE',
      targetForm: GovernanceRequestFeedbackTargetForm.NO_TARGET_PROVIDED,
      type: GovernanceRequestFeedbackType.REQUESTER,
      author: {
        commonName: 'User One',
        __typename: 'UserInfo'
      },
      createdAt: '2025-01-17T23:06:47.475119Z',
      __typename: 'GovernanceRequestFeedback'
    }
  ];

export const emptySystemIntake: SystemIntakeFragmentFragment = {
  __typename: 'SystemIntake',
  requestName: null,
  id: systemIntakeId,
  euaUserId: requester.euaUserId,
  adminLead: '',
  statusAdmin: SystemIntakeStatusAdmin.INITIAL_REQUEST_FORM_IN_PROGRESS,
  statusRequester: SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_IN_PROGRESS,
  requester: {
    __typename: 'SystemIntakeRequester',
    name: requester.commonName!,
    component: null,
    email: null
  },
  requestType: SystemIntakeRequestType.NEW,
  businessOwner: {
    __typename: 'SystemIntakeBusinessOwner',
    name: null,
    component: null
  },
  productManager: {
    __typename: 'SystemIntakeProductManager',
    name: null,
    component: null
  },
  isso: {
    __typename: 'SystemIntakeISSO',
    isPresent: false,
    name: null
  },
  governanceTeams: {
    __typename: 'SystemIntakeGovernanceTeam',
    isPresent: false,
    teams: null
  },
  existingFunding: null,
  fundingSources: [],
  costs: {
    __typename: 'SystemIntakeCosts',
    expectedIncreaseAmount: null,
    isExpectingIncrease: null
  },
  annualSpending: {
    __typename: 'SystemIntakeAnnualSpending',
    currentAnnualSpending: null,
    currentAnnualSpendingITPortion: null,
    plannedYearOneSpending: null,
    plannedYearOneSpendingITPortion: null
  },
  contract: {
    __typename: 'SystemIntakeContract',
    hasContract: null,
    contractor: null,
    vehicle: null,
    startDate: {
      __typename: 'ContractDate',
      month: null,
      day: null,
      year: null
    },
    endDate: {
      __typename: 'ContractDate',
      month: null,
      day: null,
      year: null
    }
  },
  decisionNextSteps: null,
  businessNeed: null,
  businessSolution: null,
  currentStage: null,
  needsEaSupport: null,
  usesAiTech: null,
  usingSoftware: null,
  acquisitionMethods: [],
  grtReviewEmailBody: null,
  decidedAt: null,
  submittedAt: null,
  grbDate: null,
  grtDate: null,
  governanceRequestFeedbacks: [],
  lcid: null,
  lcidIssuedAt: null,
  lcidExpiresAt: null,
  lcidRetiresAt: null,
  lcidScope: null,
  lcidCostBaseline: null,
  lcidStatus: null,
  rejectionReason: null,
  updatedAt: null,
  createdAt: '2024-01-02T19:36:50.127999Z',
  businessCaseId: null,
  archivedAt: null,
  hasUiChanges: null,
  documents: [],
  state: SystemIntakeState.OPEN,
  decisionState: SystemIntakeDecisionState.NO_DECISION,
  trbFollowUpRecommendation: null,
  requestFormState: SystemIntakeFormState.IN_PROGRESS,
  relationType: null,
  contractName: 'My contract',
  contractNumbers: [
    {
      __typename: 'SystemIntakeContractNumber',
      id: '34t53432',
      contractNumber: '123456-7890'
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
  ],
  relatedIntakes: [],
  relatedTRBRequests: [],
  grbPresentationLinks,
  grbReviewType: SystemIntakeGRBReviewType.STANDARD,
  grbVotingInformation: {
    __typename: 'GRBVotingInformation',
    grbReviewers: [],
    numberOfNoObjection: 0,
    numberOfNotVoted: 0,
    numberOfObjection: 0,
    votingStatus: GRBVotingInformationStatus.NOT_STARTED
  }
};

export const systemIntake: SystemIntakeFragmentFragment = {
  __typename: 'SystemIntake',
  requestName: 'Mock System Intake Request',
  id: systemIntakeId,
  euaUserId: requester.euaUserId,
  adminLead: '',
  statusAdmin: SystemIntakeStatusAdmin.INITIAL_REQUEST_FORM_SUBMITTED,
  statusRequester: SystemIntakeStatusRequester.INITIAL_REQUEST_FORM_SUBMITTED,
  requester: {
    __typename: 'SystemIntakeRequester',
    name: requester.commonName!,
    component: requester.component,
    email: requester.email
  },
  requestType: SystemIntakeRequestType.NEW,
  businessOwner: {
    __typename: 'SystemIntakeBusinessOwner',
    name: businessOwner.commonName,
    component: businessOwner.component
  },
  productManager: {
    __typename: 'SystemIntakeProductManager',
    name: productManager.commonName,
    component: productManager.component
  },
  isso: {
    __typename: 'SystemIntakeISSO',
    isPresent: true,
    name: isso.commonName
  },
  governanceTeams: {
    __typename: 'SystemIntakeGovernanceTeam',
    isPresent: false,
    teams: null
  },
  existingFunding: false,
  fundingSources: [],
  costs: {
    __typename: 'SystemIntakeCosts',
    expectedIncreaseAmount: '',
    isExpectingIncrease: 'NO'
  },
  annualSpending: {
    __typename: 'SystemIntakeAnnualSpending',
    currentAnnualSpending: '',
    currentAnnualSpendingITPortion: '',
    plannedYearOneSpending: '',
    plannedYearOneSpendingITPortion: ''
  },
  contract: {
    __typename: 'SystemIntakeContract',
    hasContract: 'IN_PROGRESS',
    contractor: 'TrussWorks, Inc.',
    vehicle: 'Sole Source',
    startDate: {
      __typename: 'ContractDate',
      month: '1',
      day: '',
      year: '2020'
    },
    endDate: {
      __typename: 'ContractDate',
      month: '12',
      day: '',
      year: '2020'
    }
  },
  decisionNextSteps: '',
  businessNeed: 'The quick brown fox jumps over the lazy dog.',
  businessSolution: 'The quick brown fox jumps over the lazy dog.',
  currentStage: 'The quick brown fox jumps over the lazy dog.',
  needsEaSupport: false,
  usesAiTech: true,
  usingSoftware: 'NO',
  acquisitionMethods: [],
  grtReviewEmailBody: 'The quick brown fox jumps over the lazy dog.',
  decidedAt: null,
  submittedAt: '2022-10-20T14:55:47.88283Z',
  grbDate: null,
  grtDate: null,
  governanceRequestFeedbacks: [],
  lcid: null,
  lcidIssuedAt: null,
  lcidExpiresAt: null,
  lcidRetiresAt: null,
  lcidScope: null,
  lcidCostBaseline: null,
  lcidStatus: null,
  rejectionReason: null,
  updatedAt: null,
  createdAt: '2022-10-21T14:55:47.88283Z',
  businessCaseId: null,
  archivedAt: null,
  hasUiChanges: false,
  documents: [],
  state: SystemIntakeState.OPEN,
  decisionState: SystemIntakeDecisionState.NO_DECISION,
  trbFollowUpRecommendation: null,
  requestFormState: SystemIntakeFormState.SUBMITTED,
  relationType: null,
  contractName: 'My contract',
  contractNumbers: [
    {
      __typename: 'SystemIntakeContractNumber',
      id: '34t53432',
      contractNumber: '123456-7890'
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
  ],
  relatedIntakes: [
    {
      __typename: 'SystemIntake',
      id: '1',
      requestName: 'related intake 1',
      contractNumbers: [
        { __typename: 'SystemIntakeContractNumber', contractNumber: '1' },
        { __typename: 'SystemIntakeContractNumber', contractNumber: '2' }
      ],
      decisionState: SystemIntakeDecisionState.NO_DECISION,
      submittedAt: new Date().toString()
    }
  ],
  relatedTRBRequests: [
    {
      __typename: 'TRBRequest',
      id: '2',
      name: 'related trb 1',
      contractNumbers: [
        {
          __typename: 'TRBRequestContractNumber',
          contractNumber: '1'
        },
        {
          __typename: 'TRBRequestContractNumber',
          contractNumber: '2'
        }
      ],
      status: TRBRequestStatus.FOLLOW_UP_REQUESTED,
      createdAt: new Date().toString()
    }
  ],
  grbPresentationLinks,
  grbReviewType: SystemIntakeGRBReviewType.STANDARD,
  grbVotingInformation: {
    __typename: 'GRBVotingInformation',
    grbReviewers: [],
    votingStatus: GRBVotingInformationStatus.IN_PROGRESS,
    numberOfNoObjection: 1,
    numberOfObjection: 2,
    numberOfNotVoted: 3
  }
};

export const systemIntakeForTable: GetSystemIntakesTableQuery['systemIntakes'][number] =
  {
    __typename: 'SystemIntake',
    id: '1',
    euaUserId: '',
    requestName: '',
    statusAdmin: SystemIntakeStatusAdmin.INITIAL_REQUEST_FORM_IN_PROGRESS,
    state: SystemIntakeState.OPEN,
    requesterName: systemIntake.requester.name,
    requesterComponent: systemIntake.requester.component,
    businessOwner: systemIntake.businessOwner,
    productManager: systemIntake.productManager,
    isso: systemIntake.isso,
    trbCollaboratorName: '',
    oitSecurityCollaboratorName: '',
    eaCollaboratorName: '',
    existingFunding: false,
    fundingSources: [],
    annualSpending: {
      __typename: 'SystemIntakeAnnualSpending',
      currentAnnualSpending: 'Current annual spending',
      currentAnnualSpendingITPortion: 'Current annual spending IT portion',
      plannedYearOneSpending: 'Planned year one spending',
      plannedYearOneSpendingITPortion: 'Planned year one spending IT portion'
    },
    contract: systemIntake.contract,
    contractName: '',
    contractNumbers: [],
    systems: [],
    businessNeed: systemIntake.businessNeed,
    businessSolution: systemIntake.businessSolution,
    currentStage: systemIntake.currentStage,
    needsEaSupport: systemIntake.needsEaSupport,
    usesAiTech: systemIntake.usesAiTech,
    usingSoftware: systemIntake.usingSoftware,
    acquisitionMethods: systemIntake.acquisitionMethods,
    grtDate: systemIntake.grtDate,
    grbDate: systemIntake.grbDate,
    lcid: null,
    lcidScope: null,
    lcidExpiresAt: null,
    adminLead: null,
    notes: [],
    actions: [],
    decidedAt: null,
    submittedAt: null,
    updatedAt: null,
    createdAt: systemIntake.createdAt,
    archivedAt: null,
    hasUiChanges: null
  };

export const getSystemIntakeQuery = (
  intakeData?: Partial<SystemIntakeFragmentFragment>
): MockedQuery<GetSystemIntakeQuery, GetSystemIntakeQueryVariables> => {
  return {
    request: {
      query: GetSystemIntakeDocument,
      variables: {
        id: intakeData?.id || systemIntakeId
      }
    },
    result: {
      data: {
        __typename: 'Query',
        systemIntake: {
          ...systemIntake,
          ...intakeData
        }
      }
    }
  };
};

export const systemIntakeWithLcid: GetSystemIntakesWithLCIDSQuery['systemIntakesWithLcids'][number] =
  {
    __typename: 'SystemIntake',
    id: '8be3f86d-a4d6-446b-8a56-dc9da77ed326',
    lcid: '123456',
    requestName: 'Test request name',
    lcidExpiresAt: DateTime.local().plus({ year: 1 }).toISO(),
    lcidScope: 'Test scope',
    decisionNextSteps: 'Test next steps',
    trbFollowUpRecommendation: SystemIntakeTRBFollowUp.NOT_RECOMMENDED,
    lcidCostBaseline: 'Text cost baseline'
  };

export const getSystemIntakesWithLcidsQuery: MockedQuery<GetSystemIntakesWithLCIDSQuery> =
  {
    request: {
      query: GetSystemIntakesWithLCIDSDocument,
      variables: {}
    },
    result: {
      data: {
        __typename: 'Query',
        systemIntakesWithLcids: [
          systemIntakeWithLcid,
          {
            __typename: 'SystemIntake',
            id: '8be3f86d-a4d6-446b-8a56-dc9da77ed326',
            lcid: '654321',
            requestName: 'Test request name 2',
            lcidExpiresAt: null,
            lcidScope: null,
            decisionNextSteps: null,
            trbFollowUpRecommendation: null,
            lcidCostBaseline: null
          }
        ]
      }
    }
  };

export const getSystemIntakeContactsQuery: MockedQuery<GetSystemIntakeContactsQuery> =
  {
    request: {
      query: GetSystemIntakeContactsDocument,
      variables: {
        id: systemIntakeId
      }
    },
    result: {
      // @ts-ignore
      data: {
        __typename: 'Query',
        systemIntakeContacts: {
          __typename: 'SystemIntakeContactsPayload',
          systemIntakeContacts: [requester, businessOwner, isso]
        }
      }
    }
  };

export const taskListSystemIntake: NonNullable<
  GetGovernanceTaskListQuery['systemIntake']
> = {
  __typename: 'SystemIntake',
  id: systemIntakeId,
  requestName: 'Mock system intake',
  itGovTaskStatuses: {
    __typename: 'ITGovTaskStatuses',
    intakeFormStatus: ITGovIntakeFormStatus.READY,
    feedbackFromInitialReviewStatus: ITGovFeedbackStatus.CANT_START,
    decisionAndNextStepsStatus: ITGovDecisionStatus.CANT_START,
    bizCaseDraftStatus: ITGovDraftBusinessCaseStatus.CANT_START,
    grtMeetingStatus: ITGovGRTStatus.CANT_START,
    bizCaseFinalStatus: ITGovFinalBusinessCaseStatus.CANT_START,
    grbMeetingStatus: ITGovGRBStatus.CANT_START
  },
  step: SystemIntakeStep.INITIAL_REQUEST_FORM,
  state: SystemIntakeState.OPEN,
  decisionState: SystemIntakeDecisionState.NO_DECISION,
  governanceRequestFeedbacks: [],
  submittedAt: null,
  updatedAt: null,
  grtDate: null,
  grbDate: null,
  businessCase: null,
  relationType: null,
  contractName: null,
  contractNumbers: [],
  systems: [],
  grbReviewType: SystemIntakeGRBReviewType.STANDARD,
  grbReviewStartedAt: null,
  grbReviewAsyncEndDate: null,
  grbReviewAsyncGRBMeetingTime: null
};

export const getGovernanceTaskListQuery = (
  taskListData?: Partial<GetGovernanceTaskListQuery['systemIntake']>
): MockedQuery<
  GetGovernanceTaskListQuery,
  GetGovernanceTaskListQueryVariables
> => ({
  request: {
    query: GetGovernanceTaskListDocument,
    variables: {
      id: systemIntakeId
    }
  },
  result: {
    data: {
      __typename: 'Query',
      systemIntake: {
        ...taskListSystemIntake,
        ...taskListData
      }
    }
  }
});

const currentYear = DateTime.local().year;
export const systemIntakesWithReviewRequested: SystemIntakeWithReviewRequestedFragment[] =
  [
    {
      id: 'a5689bec-e4cf-4f2b-a7de-72020e8d65be',
      requestName: 'With GRB scheduled',
      requesterName: users[3].commonName,
      requesterComponent: 'Office of Enterprise Data and Analytics',
      grbDate: `${currentYear + 2}-10-02T03:11:24.478056Z`,
      __typename: 'SystemIntake'
    },
    {
      id: '5af245bc-fc54-4677-bab1-1b3e798bb43c',
      requestName: 'System Intake with GRB Reviewers',
      requesterName: 'User One',
      requesterComponent: 'Office of the Actuary',
      grbDate: '2020-10-08T03:11:24.478056Z',
      __typename: 'SystemIntake'
    },
    {
      id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
      requestName: 'Edits requested on initial request form',
      requesterName: users[0].commonName,
      requesterComponent: 'Federal Coordinated Health Care Office',
      grbDate: null,
      __typename: 'SystemIntake'
    },
    {
      id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
      requestName: 'Mock System Intake 1',
      requesterName: users[1].commonName,
      requesterComponent: 'Office of Communications',
      grbDate: '2024-03-29T03:11:24.478056Z',
      __typename: 'SystemIntake'
    },
    {
      id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
      requestName: 'Mock System Intake 2',
      requesterName: users[2].commonName,
      requesterComponent: 'Office of the Actuary',
      grbDate: `${currentYear + 1}-06-09T03:11:24.478056Z`,
      __typename: 'SystemIntake'
    },

    {
      id: '20cbcfbf-6459-4c96-943b-e76b83122dbf',
      requestName: 'Closable Request',
      requesterName: users[3].commonName,
      requesterComponent: 'Office of Information Technology',
      grbDate: '2023-01-18T03:11:24.478056Z',
      __typename: 'SystemIntake'
    },
    {
      id: '29486f85-1aba-4eaf-a7dd-6137b9873adc',
      requestName: 'Mock System Intake 3',
      requesterName: users[2].commonName,
      requesterComponent: 'Office of Information Technology',
      grbDate: null,
      __typename: 'SystemIntake'
    }
  ];
