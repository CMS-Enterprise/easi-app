import { DateTime } from 'luxon';

import { ProgressStatus } from './components/Progress';
import { DocumentType, Project, RequestStep } from './types';

const projects: Record<string, Project> = {
  1: {
    id: 1,
    name: 'TACO',
    release: '1.3',
    status: RequestStep.DocumentsReceived,
    submissionDate: DateTime.fromISO('2020-12-28'),
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
        date: DateTime.fromISO('2020-11-25'),
        status: ProgressStatus.Completed
      },
      [RequestStep.DocumentsReceived]: {
        date: DateTime.fromISO('2020-11-25'),
        status: ProgressStatus.Completed
      },
      // [RequestStep.TestScheduled]: {
      //   date: DateTime.fromISO('2020-11-25'),
      //   status: ProgressStatus.Completed
      // },
      [RequestStep.RemediationRequested]: {
        date: DateTime.fromISO('2020-11-25'),
        status: ProgressStatus.Current
      }
    },
    documents: [
      {
        id: 2,
        type: DocumentType.TestingVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-11-25')
      },
      {
        id: 3,
        type: DocumentType.TestPlan,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-11-25')
      },
      {
        id: 4,
        type: DocumentType.AwardedVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-11-11')
      }
    ],
    notes: [
      {
        id: 4,
        content:
          'We are waiting on the test plan and VPAT from business owner.',
        createdAt: DateTime.fromISO('2020-11-19'),
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
    status: RequestStep.DocumentsReceived,
    submissionDate: DateTime.fromISO('2020-08-28'),
    lastUpdatedAt: DateTime.fromISO('2021-01-05'),
    businessOwner: {
      name: 'Marny Land',
      component: 'OIT'
    },
    pointOfContact: {
      name: 'Aaron Allen',
      component: 'OIT'
    },
    stepStatuses: {},
    documents: [
      {
        id: 1,
        type: DocumentType.TestResults,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-11-30'),
        score: 70
      },
      {
        id: 2,
        type: DocumentType.TestingVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-11-21')
      },
      {
        id: 3,
        type: DocumentType.TestPlan,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-11-21')
      },
      {
        id: 4,
        type: DocumentType.AwardedVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-10-29')
      }
    ],
    notes: [],
    pastRequests: [],
    lifecycleID: 'X200943'
  },
  3: {
    id: 3,
    name: 'Migration Pipeline',
    release: '2.0',
    status: RequestStep.TestScheduled,
    submissionDate: DateTime.fromISO('2021-01-09'),
    lastUpdatedAt: DateTime.fromISO('2021-01-09'),
    businessOwner: {
      name: 'Connie Leonard',
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
    submissionDate: DateTime.fromISO('2021-01-15'),
    lastUpdatedAt: DateTime.fromISO('2021-01-15'),
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
    status: RequestStep.TestScheduled,
    submissionDate: DateTime.fromISO('2021-01-03'),
    lastUpdatedAt: DateTime.fromISO('2020-03-17'),
    businessOwner: {
      name: 'Luke Jordan',
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
  7: {
    id: 7,
    name: 'Medicare Payments Processing',
    release: '2.0',
    status: RequestStep.TestScheduled,
    submissionDate: DateTime.fromISO('2021-01-04'),
    lastUpdatedAt: DateTime.fromISO('2020-12-27'),
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
    submissionDate: DateTime.fromISO('2021-01-12'),
    lastUpdatedAt: DateTime.fromISO('2021-01-12'),
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
    submissionDate: DateTime.fromISO('2020-09-09'),
    lastUpdatedAt: DateTime.fromISO('2021-01-10'),
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
