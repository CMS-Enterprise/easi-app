import { CMSOffice } from 'constants/enums/cmsDivisionsAndOffices';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { GetSystemIntakeContactsQuery } from 'queries/SystemIntakeContactsQueries';
import {
  GetSystemIntake,
  GetSystemIntake_systemIntake as SystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import {
  GetSystemIntakeContacts,
  GetSystemIntakeContactsVariables
} from 'queries/types/GetSystemIntakeContacts';
import { SystemIntakeContact } from 'queries/types/SystemIntakeContact';
import { SystemIntakeDocument } from 'queries/types/SystemIntakeDocument';
import {
  SystemIntakeDecisionState,
  SystemIntakeDocumentCommonType,
  SystemIntakeDocumentStatus,
  SystemIntakeRequestType,
  SystemIntakeState,
  SystemIntakeStatus
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

export const systemIntake: SystemIntake = {
  __typename: 'SystemIntake',
  requestName: 'Mock System Intake Request',
  id: systemIntakeId,
  euaUserId: requester.euaUserId,
  adminLead: '',
  status: SystemIntakeStatus.INTAKE_SUBMITTED,
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
    plannedYearOneSpending: ''
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
  grtFeedbacks: [],
  lcid: null,
  lcidExpiresAt: null,
  lcidScope: null,
  lcidCostBaseline: null,
  rejectionReason: null,
  updatedAt: null,
  createdAt: '2022-10-21T14:55:47.88283Z',
  businessCaseId: null,
  archivedAt: null,
  lastAdminNote: {
    __typename: 'LastAdminNote',
    content: null,
    createdAt: null
  },
  hasUiChanges: false,
  documents: [],
  state: SystemIntakeState.OPEN,
  decisionState: SystemIntakeDecisionState.NO_DECISION
};

export const getSystemIntakeQuery: MockedQuery<
  GetSystemIntake,
  GetSystemIntakeVariables
> = {
  request: {
    query: GetSystemIntakeQuery,
    variables: {
      id: systemIntakeId
    }
  },
  result: {
    data: {
      systemIntake
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
