import { DateTime } from 'luxon';

import { ProgressStatus } from './components/Progress';
import { DocumentType, Project, RequestStep } from './types';

const projects: Record<string, Project> = {
  1: {
    id: 1,
    name: 'TACO',
    release: '1.3',
    status: RequestStep.DocumentsReceived,
    submissionDate: DateTime.fromISO('2020-11-10'),
    testDate: DateTime.fromISO('2020-11-10'),
    remediationStartDate: DateTime.fromISO('2020-11-10'),
    lastUpdatedAt: DateTime.fromISO('2020-11-25'),
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
      [RequestStep.TestScheduled]: {
        date: DateTime.fromISO('2020-11-25'),
        status: ProgressStatus.Completed
      },
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
    status: RequestStep.TestScheduled,
    submissionDate: DateTime.fromISO('2020-08-28'),
    testDate: DateTime.fromISO('2020-11-10'),
    lastUpdatedAt: DateTime.fromISO('2020-11-30'),
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

    lifecycleID: 'X200943'
  },
  3: {
    id: 3,
    name: 'Migration Pipeline',
    status: RequestStep.RemediationInProgress,
    submissionDate: DateTime.fromISO('2020-07-16'),
    testDate: DateTime.fromISO('2020-11-10'),
    lastUpdatedAt: DateTime.fromISO('2020-10-03'),
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
    stepStatuses: {},
    lifecycleID: 'X200943'
  },
  4: {
    id: 4,
    name: '(USDS) Dashboard for USDS',
    status: RequestStep.RemediationInProgress,
    submissionDate: DateTime.fromISO('2020-05-21'),
    lastUpdatedAt: DateTime.fromISO('2020-09-14'),
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
    stepStatuses: {},
    lifecycleID: 'X200943'
  },
  5: {
    id: 5,
    name: 'OSORA FOIA Portal Project',
    status: RequestStep.RemediationInProgress,
    submissionDate: DateTime.fromISO('2020-01-02'),
    lastUpdatedAt: DateTime.fromISO('2020-03-17'),
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
    stepStatuses: {},
    lifecycleID: 'X200943'
  }
};

export default projects;
