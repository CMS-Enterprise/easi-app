import GetCedarContactsQuery from 'queries/GetCedarContactsQuery';
import { GetSystemIntakeContactsQuery } from 'queries/SystemIntakeContactsQueries';

const systemIntakeId = 'a4158ad8-1236-4a55-9ad5-7e15a5d49de2';

const requester = {
  systemIntakeId,
  role: 'Requester',
  euaUserId: 'SF13',
  commonName: 'Jerry Seinfeld',
  component: 'Center for Medicaid and CHIP Services',
  email: 'sf13@local.fake',
  id: 'dadffca7-35ef-4498-974b-e5fe95ff028e'
};

const businessOwner = {
  systemIntakeId,
  role: 'Business Owner',
  euaUserId: 'SF13',
  commonName: 'Jerry Seinfeld',
  component: 'Center for Medicaid and CHIP Services',
  email: 'sf13@local.fake',
  id: 'b25bd13b-72a0-4d0e-b5be-7852a1a8259d'
};

const productManager = {
  systemIntakeId,
  euaUserId: 'KR14',
  role: 'Product Manager',
  commonName: 'Cosmo Kramer',
  component: 'Center for Program Integrity',
  email: 'kr14@local.fake',
  id: '' // Leave out ID so contact shows as unverified
};

const isso = {
  systemIntakeId,
  euaUserId: 'WXYZ',
  role: 'ISSO',
  commonName: 'John Smith',
  component: 'CMS Wide',
  email: 'wxyz@local.fake',
  id: '346eefa9-c635-4c0b-bc29-26f272c33d0c'
};

const systemIntake = {
  id: systemIntakeId,
  euaUserId: requester.euaUserId,
  adminLead: '',
  businessNeed: 'Test business need',
  businessSolution: 'Test business solution',
  businessOwner: {
    component: businessOwner.component,
    name: businessOwner.commonName
  },
  contract: {
    contractor: 'Contractor Name',
    endDate: {
      day: '31',
      month: '12',
      year: '2023'
    },
    hasContract: 'HAVE_CONTRACT',
    startDate: {
      day: '1',
      month: '1',
      year: '2021'
    },
    vehicle: 'Sole source',
    number: '123456-7890'
  },
  costs: {
    isExpectingIncrease: 'YES',
    expectedIncreaseAmount: '10 million dollars'
  },
  annualSpending: {
    currentAnnualSpending: 'Test Current Annual Spending',
    plannedYearOneSpending: 'Test Planned Year One Spending'
  },
  currentStage: 'I have done some initial research',
  decisionNextSteps: '',
  grbDate: null,
  grtDate: null,
  grtFeedbacks: [],
  governanceTeams: {
    isPresent: true,
    teams: []
  },
  isso: {
    isPresent: true,
    component: isso.component,
    name: isso.commonName
  },
  existingFunding: true,
  fundingSources: [{ fundingNumber: '123456', source: 'Research' }],
  lcid: '',
  lcidExpiresAt: null,
  lcidScope: '',
  lcidCostBaseline: null,
  needsEaSupport: true,
  productManager: {
    component: productManager.component,
    name: productManager.commonName
  },
  rejectionReason: '',
  requester: {
    component: requester.component,
    email: requester.email,
    name: requester.commonName
  },
  requestName: 'TACO',
  requestType: 'NEW',
  status: 'INTAKE_SUBMITTED',
  createdAt: null,
  submittedAt: null,
  updatedAt: null,
  archivedAt: null,
  decidedAt: null,
  businessCaseId: null,
  lastAdminNote: null,
  grtReviewEmailBody: '',
  hasUiChanges: true,
  documents: []
};

export const mockData = {
  contacts: {
    requester,
    businessOwner,
    productManager,
    isso
  },
  systemIntake
};
export const contactQueries = {
  getSystemIntakeContactsQuery: {
    request: {
      query: GetSystemIntakeContactsQuery,
      variables: {
        id: systemIntakeId
      }
    },
    result: {
      data: {
        systemIntakeContacts: {
          systemIntakeContacts: [requester, businessOwner, isso]
        }
      }
    }
  },
  getCedarContactsQuery: {
    request: {
      query: GetCedarContactsQuery,
      variables: {
        commonName: productManager.commonName
      }
    },
    result: {
      data: {
        cedarPersonsByCommonName: [
          {
            commonName: productManager.commonName,
            email: productManager.email,
            euaUserId: productManager.euaUserId
          }
        ]
      }
    }
  }
};

export const grtActions = {
  'not-it-request': {
    heading: 'Not an IT governance request',
    view: 'grt-submit-action-view'
  },
  'need-biz-case': {
    heading: 'Request a draft business case',
    view: 'grt-submit-action-view'
  },
  'provide-feedback-need-biz-case': {
    heading: 'Provide GRT Feedback and progress to business case',
    view: 'provide-feedback-biz-case'
  },
  'provide-feedback-keep-draft': {
    heading: 'Provide GRT feedback and keep working on draft business case',
    view: 'provide-feedback-biz-case'
  },
  'provide-feedback-need-final': {
    heading: 'Provide GRT feedback and request final business case for GRB',
    view: 'provide-feedback-biz-case'
  },
  'ready-for-grt': {
    heading: 'Mark as ready for GRT',
    view: 'grt-submit-action-view'
  },
  'ready-for-grb': {
    heading: 'Mark as ready for GRB',
    view: 'ready-for-grb'
  },
  'biz-case-needs-changes': {
    heading: 'Business case needs changes and is not ready for GRT',
    view: 'grt-submit-action-view'
  },
  'no-governance': {
    heading: 'Close project',
    view: 'grt-submit-action-view'
  },
  'send-email': {
    heading: 'Send email',
    view: 'grt-submit-action-view'
  },
  'guide-received-close': {
    heading: 'Decomission guide received. Close the request',
    view: 'grt-submit-action-view'
  },
  'not-responding-close': {
    heading: 'Project team not responding. Close the request',
    view: 'grt-submit-action-view'
  },
  'issue-lcid': {
    heading: 'Approve request and issue Life Cycle ID',
    view: 'issue-lcid'
  },
  'extend-lcid': {
    heading: 'Extend Life Cycle ID',
    view: 'extend-lcid'
  },
  'not-approved': {
    heading: 'Business case not approved',
    view: 'not-approved'
  }
};
