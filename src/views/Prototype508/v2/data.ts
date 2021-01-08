import { DateTime } from 'luxon';

import { ProgressStatus } from './components/Progress';
import { DocumentType, Project, RequestStep } from './types';

const projects: Record<string, Project> = {
  1: {
    id: 1,
    name: 'TACO',
    release: '1.3',
    status: RequestStep.DocumentsReceived,
    submissionDate: DateTime.fromISO('2021-01-04'),
    lastUpdatedAt: DateTime.fromISO('2021-01-06'),
    businessOwner: {
      name: 'Shane Clark',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    lifecycleID: 'X200943',
    stepStatuses: {
      [RequestStep.RequestReceived]: {
        status: ProgressStatus.Completed
      },
      [RequestStep.DocumentsReceived]: {
        status: ProgressStatus.Current
      }
    },
    documents: [
      {
        id: 2,
        type: DocumentType.TestingVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2021-01-08')
      },
      {
        id: 3,
        type: DocumentType.TestPlan,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2021-01-08')
      },
      {
        id: 4,
        type: DocumentType.AwardedVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2021-01-04')
      }
    ],
    notes: [
      {
        id: 4,
        content:
          'We are waiting on the test plan and VPAT from business owner.',
        createdAt: DateTime.fromISO('2021-01-04'),
        authorName: 'Aaron Allen'
      }
    ],
    description:
      'TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience.',
    pastRequests: [
      {
        name: 'TACO',
        release: '1.2',
        lastTestDate: DateTime.fromISO('2020-08-28')
      },
      {
        name: 'TACO',
        release: '1.1',
        lastTestDate: DateTime.fromISO('2020-02-28')
      }
    ]
  },
  2: {
    id: 2,
    name: 'Impact Analysis Network',
    status: RequestStep.RequestReceived,
    submissionDate: DateTime.fromISO('2020-12-28'),
    lastUpdatedAt: DateTime.fromISO('2020-12-28'),
    businessOwner: {
      name: 'Marny Land',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    stepStatuses: {
      [RequestStep.RequestReceived]: {
        status: ProgressStatus.Current
      }
    },
    documents: [
      {
        id: 4,
        type: DocumentType.AwardedVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-12-28')
      }
    ],
    notes: [
      {
        id: 4,
        content:
          "I sent over the templates, but since it's the holidays I don't expect to hear back until the first week of January.",
        createdAt: DateTime.fromISO('2020-12-28'),
        authorName: 'Aaron Allen'
      }
    ],
    pastRequests: [],
    lifecycleID: 'X200943'
  },
  3: {
    id: 3,
    name: 'Migration Pipeline',
    release: '2.0',
    status: RequestStep.TestScheduled,
    submissionDate: DateTime.fromISO('2020-12-16'),
    lastUpdatedAt: DateTime.fromISO('2021-01-04'),
    testDate: DateTime.fromISO('2021-01-08'),
    businessOwner: {
      name: 'Connie Leonard',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    notes: [
      {
        id: 4,
        content:
          "I sent over the templates, but since it's the holidays I don't expect to hear back until the first week of January.",
        createdAt: DateTime.fromISO('2020-12-28'),
        authorName: 'Nikita Hall'
      },
      {
        id: 5,
        content:
          'Test is complete. Waiting for program team to check results and decide how to proceed.',
        createdAt: DateTime.fromISO('2021-01-11'),
        authorName: 'Nikita Hall'
      }
    ],
    documents: [
      {
        id: 4,
        type: DocumentType.AwardedVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-12-16'),
        testDate: DateTime.fromISO('2021-01-08')
      },
      {
        id: 2,
        type: DocumentType.TestingVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2021-01-05'),
        testDate: DateTime.fromISO('2021-01-08')
      },
      {
        id: 3,
        type: DocumentType.TestPlan,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2021-01-05'),
        testDate: DateTime.fromISO('2021-01-08')
      },
      {
        id: 5,
        type: DocumentType.TestResults,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2021-01-11'),
        testDate: DateTime.fromISO('2021-01-08'),
        score: 70
      }
    ],
    pastRequests: [],
    stepStatuses: {
      [RequestStep.RequestReceived]: {
        status: ProgressStatus.Completed
      },
      [RequestStep.DocumentsReceived]: {
        status: ProgressStatus.Completed
      },
      [RequestStep.TestScheduled]: {
        date: DateTime.fromISO('2021-01-08'),
        status: ProgressStatus.Current
      }
    },
    lifecycleID: 'X200943'
  },
  30: {
    id: 30,
    name: 'Migration Pipeline',
    release: '1.0',
    status: RequestStep.RemediationInProgress,
    submissionDate: DateTime.fromISO('2020-12-16'),
    lastUpdatedAt: DateTime.fromISO('2021-01-11'),
    remediationStartDate: DateTime.fromISO('2020-09-19'),
    businessOwner: {
      name: 'Connie Leonard',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    notes: [
      {
        id: 4,
        content: 'I sent over the templates.',
        createdAt: DateTime.fromISO('2020-08-23'),
        authorName: 'Nikita Hall'
      },
      {
        id: 5,
        content:
          'Test is complete. Waiting for program team to check results and decide how to proceed.',
        createdAt: DateTime.fromISO('2020-09-01'),
        authorName: 'Nikita Hall'
      },
      {
        id: 6,
        content:
          "They'll be in remediation for a few months. Aaron Allen will keep in touch with them.",
        createdAt: DateTime.fromISO('2020-09-19'),
        authorName: 'Nikita Hall'
      }
    ],
    documents: [
      {
        id: 4,
        type: DocumentType.AwardedVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-08-23'),
        testDate: DateTime.fromISO('2020-09-01')
      },
      {
        id: 2,
        type: DocumentType.TestingVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-08-26'),
        testDate: DateTime.fromISO('2020-09-01')
      },
      {
        id: 3,
        type: DocumentType.TestPlan,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-08-26'),
        testDate: DateTime.fromISO('2020-09-01')
      },
      {
        id: 5,
        type: DocumentType.TestResults,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-09-01'),
        testDate: DateTime.fromISO('2020-09-01'),
        score: 70
      }
    ],
    pastRequests: [],
    stepStatuses: {
      [RequestStep.RequestReceived]: {
        status: ProgressStatus.Completed
      },
      [RequestStep.DocumentsReceived]: {
        status: ProgressStatus.Completed
      },
      [RequestStep.TestScheduled]: {
        date: DateTime.fromISO('2020-09-01'),
        status: ProgressStatus.Completed
      },
      [RequestStep.RemediationRequested]: {
        status: ProgressStatus.Completed
      },
      [RequestStep.RemediationInProgress]: {
        date: DateTime.fromISO('2020-09-19'),
        status: ProgressStatus.Current
      }
    },
    lifecycleID: 'X200943'
  },
  4: {
    id: 4,
    name: '(USDS) Dashboard for USDS',
    release: '1.7',
    status: RequestStep.RequestReceived,
    submissionDate: DateTime.fromISO('2021-01-10'),
    lastUpdatedAt: DateTime.fromISO('2021-01-10'),
    businessOwner: {
      name: 'Ada Sanchez',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    notes: [],
    documents: [],
    pastRequests: [],
    stepStatuses: {},
    lifecycleID: 'X200943'
  },
  5: {
    id: 5,
    name: 'OSORA FOIA Portal Project',
    release: '3.0',
    status: RequestStep.RequestReceived,
    submissionDate: DateTime.fromISO('2021-01-08'),
    lastUpdatedAt: DateTime.fromISO('2021-01-08'),
    businessOwner: {
      name: 'Amanda Johnson',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    notes: [],
    documents: [],
    pastRequests: [],
    stepStatuses: {},
    lifecycleID: 'X200943'
  },
  6: {
    id: 6,
    name: 'System Integration for Paywall Processing',
    release: '1.1',
    status: RequestStep.RemediationInProgress,
    submissionDate: DateTime.fromISO('2020-07-13'),
    lastUpdatedAt: DateTime.fromISO('2020-08-10'),
    remediationStartDate: DateTime.fromISO('2020-08-10'),
    businessOwner: {
      name: 'Luke Jordan',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    notes: [
      {
        id: 4,
        content:
          'We are waiting on the test plan and VPAT from business owner.',
        createdAt: DateTime.fromISO('2020-07-07'),
        authorName: 'Aaron Allen'
      },
      {
        id: 5,
        content:
          'Test plan and VPAT are approved. Waiting on Nikita for test date.',
        createdAt: DateTime.fromISO('2020-07-15'),
        authorName: 'Aaron Allen'
      },
      {
        id: 6,
        content:
          "This team needs to go into remediation. I've sent them an email with the remediation plan template.",
        createdAt: DateTime.fromISO('2020-07-28'),
        authorName: 'Aaron Allen'
      },
      {
        id: 7,
        content:
          "I checked in with the team. They're still remediating but will be ready to test again in January.",
        createdAt: DateTime.fromISO('2020-10-19'),
        authorName: 'Aaron Allen'
      }
    ],
    documents: [
      {
        id: 4,
        type: DocumentType.AwardedVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-07-07'),
        testDate: DateTime.fromISO('2020-07-25')
      },
      {
        id: 2,
        type: DocumentType.TestingVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-07-15'),
        testDate: DateTime.fromISO('2020-07-25')
      },
      {
        id: 3,
        type: DocumentType.TestPlan,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-07-15'),
        testDate: DateTime.fromISO('2020-07-25')
      },
      {
        id: 5,
        type: DocumentType.TestResults,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-07-27'),
        testDate: DateTime.fromISO('2020-07-25'),
        score: 85
      },
      {
        id: 6,
        type: DocumentType.RemediationPlan,
        mimetype: 'application/pdf',
        testDate: DateTime.fromISO('2020-07-25'),
        createdAt: DateTime.fromISO('2020-08-02')
      }
    ],
    pastRequests: [],
    stepStatuses: {
      [RequestStep.RequestReceived]: {
        status: ProgressStatus.Completed
      },
      [RequestStep.DocumentsReceived]: {
        status: ProgressStatus.Completed
      },
      [RequestStep.TestScheduled]: {
        date: DateTime.fromISO('2020-07-25'),
        status: ProgressStatus.Completed
      },
      [RequestStep.RemediationRequested]: {
        status: ProgressStatus.Completed
      },
      [RequestStep.RemediationInProgress]: {
        date: DateTime.fromISO('2020-08-10'),
        status: ProgressStatus.Current
      }
    },
    lifecycleID: 'X200943'
  },
  7: {
    id: 7,
    name: 'Medicare Payments Processing',
    release: '2.0',
    status: RequestStep.TestScheduled,
    submissionDate: DateTime.fromISO('2020-12-21'),
    lastUpdatedAt: DateTime.fromISO('2020-12-27'),
    testDate: DateTime.fromISO('2021-01-20'),
    businessOwner: {
      name: 'Wanda McIver',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    notes: [],
    documents: [],
    pastRequests: [],
    stepStatuses: {},
    lifecycleID: 'X200943'
  },
  8: {
    id: 8,
    name: 'Medical Redesign',
    status: RequestStep.TestScheduled,
    submissionDate: DateTime.fromISO('2020-12-20'),
    lastUpdatedAt: DateTime.fromISO('2021-01-04'),
    testDate: DateTime.fromISO('2021-01-20'),
    businessOwner: {
      name: 'Aaron Heffler',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    notes: [],
    documents: [],
    pastRequests: [],
    stepStatuses: {},
    lifecycleID: 'X200943'
  },
  9: {
    id: 9,
    name: 'Clinical Standards and Quality Migration',
    release: '1.3',
    status: RequestStep.DocumentsReceived,
    submissionDate: DateTime.fromISO('2020-12-27'),
    lastUpdatedAt: DateTime.fromISO('2021-01-04'),
    businessOwner: {
      name: 'Paul Shatto',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    notes: [],
    documents: [],
    pastRequests: [],
    stepStatuses: {},
    lifecycleID: 'X200943'
  },
  10: {
    id: 10,
    name: 'Consumer Information and Insurance Oversight Pilot Program',
    release: '1.0',
    status: RequestStep.TestScheduled,
    submissionDate: DateTime.fromISO('2020-11-30'),
    testDate: DateTime.fromISO('2020-11-20'),
    lastUpdatedAt: DateTime.fromISO('2020-12-05'),
    businessOwner: {
      name: 'Blake Limmer',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    notes: [],
    documents: [],
    pastRequests: [],
    stepStatuses: {},
    lifecycleID: 'X200943'
  }
};

export default projects;
