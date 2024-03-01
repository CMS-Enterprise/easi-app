import { DateTime } from 'luxon';

import { CMSOffice } from 'constants/enums/cmsDivisionsAndOffices';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import GetSystemIntakesWithLCIDS from 'queries/GetSystemIntakesWithLCIDS';
import { GetSystemIntakeContactsQuery } from 'queries/SystemIntakeContactsQueries';
import {
  GetGovernanceTaskList,
  GetGovernanceTaskList_systemIntake as TaskListSystemIntake,
  GetGovernanceTaskListVariables
} from 'queries/types/GetGovernanceTaskList';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import {
  GetSystemIntakeContacts,
  GetSystemIntakeContactsVariables
} from 'queries/types/GetSystemIntakeContacts';
import { GetSystemIntakesTable_systemIntakes as TableSystemIntake } from 'queries/types/GetSystemIntakesTable';
import {
  GetSystemIntakesWithLCIDS as GetSystemIntakesWithLCIDSType,
  GetSystemIntakesWithLCIDS_systemIntakesWithLcids as SystemIntakeWithLcid
} from 'queries/types/GetSystemIntakesWithLCIDS';
import { SystemIntake } from 'queries/types/SystemIntake';
import { SystemIntakeContact } from 'queries/types/SystemIntakeContact';
import { SystemIntakeDocument } from 'queries/types/SystemIntakeDocument';
import {
  ITGovDecisionStatus,
  ITGovDraftBusinessCaseStatus,
  ITGovFeedbackStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovGRBStatus,
  ITGovGRTStatus,
  ITGovIntakeFormStatus,
  SystemIntakeDecisionState,
  SystemIntakeDocumentCommonType,
  SystemIntakeDocumentStatus,
  SystemIntakeFormState,
  SystemIntakeRequestType,
  SystemIntakeState,
  SystemIntakeStatusAdmin,
  SystemIntakeStatusRequester,
  SystemIntakeStep,
  SystemIntakeTRBFollowUp
} from 'types/graphql-global-types';
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
}

const systemIntakeId = 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2';

const contacts: MockSystemIntakeContact[] = users.slice(0, 4).map(userInfo => ({
  __typename: 'AugmentedSystemIntakeContact',
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

export const documents: SystemIntakeDocument[] = [
  {
    id: '3b23fcf9-85d3-4211-a7d8-d2d08148f196',
    fileName: 'sample1.pdf',
    documentType: {
      commonType: SystemIntakeDocumentCommonType.DRAFT_ICGE,
      otherTypeDescription: null,
      __typename: 'SystemIntakeDocumentType'
    },
    status: SystemIntakeDocumentStatus.AVAILABLE,
    uploadedAt: '2023-06-14T18:24:46.310929Z',
    url:
      'http://host.docker.internal:9000/easi-app-file-uploads/ead3f487-8aaa-47d2-aa26-335e9b560a92.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=f71d5d63d68958a2bd8526c2b2cdd5abe78b21eb69d10739fe8f8e6fd5d010ec',
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
    status: SystemIntakeDocumentStatus.PENDING,
    uploadedAt: '2023-06-14T18:24:46.32661Z',
    url:
      'http://host.docker.internal:9000/easi-app-file-uploads/7e047111-6228-4943-9c4b-0961f27858f4.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=0e3f337697c616b01533accd95a316cbeabeb6990961b9881911c757837cbf95',
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
    status: SystemIntakeDocumentStatus.UNAVAILABLE,
    uploadedAt: '2023-06-14T18:24:46.342866Z',
    url:
      'http://host.docker.internal:9000/easi-app-file-uploads/f779e8e4-9c78-4b14-bbab-37618447f3f9.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230614%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230614T184943Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=7e6755645a1f163d41d2fa7c19776d0ceb4cfd3ff8e1c2918c428a551fe44764',
    __typename: 'SystemIntakeDocument'
  }
];

export const emptySystemIntake: SystemIntake = {
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
    number: null,
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
  requestFormState: SystemIntakeFormState.IN_PROGRESS
};

export const systemIntake: SystemIntake = {
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
    number: '123456-7890',
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
  requestFormState: SystemIntakeFormState.SUBMITTED
};

/** System intake form that has NOT been started */
export const initialSystemIntakeForm: SystemIntake = {
  ...systemIntake,
  requestName: '',
  requester: {
    ...systemIntake.requester,
    component: ''
  },
  businessOwner: {
    __typename: 'SystemIntakeBusinessOwner',
    name: '',
    component: ''
  },
  productManager: {
    __typename: 'SystemIntakeProductManager',
    name: '',
    component: ''
  },
  isso: {
    __typename: 'SystemIntakeISSO',
    isPresent: null,
    name: ''
  },
  contract: {
    __typename: 'SystemIntakeContract',
    hasContract: '',
    contractor: '',
    number: '',
    vehicle: '',
    startDate: {
      __typename: 'ContractDate',
      month: '',
      day: '',
      year: ''
    },
    endDate: {
      __typename: 'ContractDate',
      month: '',
      day: '',
      year: ''
    }
  },
  businessNeed: '',
  businessSolution: '',
  currentStage: ''
};

export const systemIntakeForTable: TableSystemIntake = {
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
  contractNumbers: [],
  businessNeed: systemIntake.businessNeed,
  businessSolution: systemIntake.businessSolution,
  currentStage: systemIntake.currentStage,
  needsEaSupport: systemIntake.needsEaSupport,
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
  intakeData?: Partial<SystemIntake>
): MockedQuery<GetSystemIntake, GetSystemIntakeVariables> => {
  return {
    request: {
      query: GetSystemIntakeQuery,
      variables: {
        id: intakeData?.id || systemIntakeId
      }
    },
    result: {
      data: {
        systemIntake: {
          ...systemIntake,
          ...intakeData
        }
      }
    }
  };
};

export const systemIntakeWithLcid: SystemIntakeWithLcid = {
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

export const getSystemIntakesWithLcidsQuery: MockedQuery<GetSystemIntakesWithLCIDSType> = {
  request: {
    query: GetSystemIntakesWithLCIDS,
    variables: {}
  },
  result: {
    data: {
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

export const getSystemIntakeContactsQuery: MockedQuery<
  GetSystemIntakeContacts,
  GetSystemIntakeContactsVariables
> = {
  request: {
    query: GetSystemIntakeContactsQuery,
    variables: {
      id: systemIntakeId
    }
  },
  result: {
    data: {
      systemIntakeContacts: {
        __typename: 'SystemIntakeContactsPayload',
        systemIntakeContacts: [requester, businessOwner, isso]
      }
    }
  }
};

export const taskListSystemIntake: TaskListSystemIntake = {
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
  businessCase: null
};

export const getGovernanceTaskListQuery = (
  taskListData?: Partial<GetGovernanceTaskList['systemIntake']>
): MockedQuery<GetGovernanceTaskList, GetGovernanceTaskListVariables> => ({
  request: {
    query: GetGovernanceTaskListQuery,
    variables: {
      id: systemIntakeId
    }
  },
  result: {
    data: {
      systemIntake: {
        ...taskListSystemIntake,
        ...taskListData
      }
    }
  }
});
