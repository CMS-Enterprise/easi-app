import { DateTime } from 'luxon';

import { ActivityType, DocumentType, Project, ProjectStatus } from './types';

const projects: Record<string, Project> = {
  1: {
    id: 1,
    name: 'TACO',
    status: ProjectStatus.TestingInProgress,
    submissionDate: DateTime.fromISO('2020-11-10'),
    lastUpdatedAt: DateTime.fromISO('2020-11-25'),
    businessOwner: {
      name: 'Shane Clark'
    },
    lifecycleID: 'X200943',
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
    activities: [
      {
        id: 1,
        content: 'Status changed to Testing in progress',
        createdAt: DateTime.fromISO('2020-11-25'),
        type: ActivityType.StatusChanged,
        authorName: 'Aaron Allen'
      },
      {
        id: 2,
        content: 'Testing VPAT uploaded',
        createdAt: DateTime.fromISO('2020-11-25'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 3,
        content: 'Test plan uploaded',
        createdAt: DateTime.fromISO('2020-11-25'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 4,
        content:
          'We are waiting on the test plan and VPAT from business owner.',
        createdAt: DateTime.fromISO('2020-11-19'),
        type: ActivityType.NoteAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 5,
        content: 'Awarded VPAT uploaded',
        createdAt: DateTime.fromISO('2020-11-11'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 6,
        content: 'TACO project created',
        createdAt: DateTime.fromISO('2020-11-10'),
        type: ActivityType.ProjectCreated,
        authorName: 'Aaron Allen'
      }
    ],
    description:
      'TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience.'
  },
  2: {
    id: 2,
    name: 'Impact Analysis Network',
    status: ProjectStatus.TestingCompleted,
    submissionDate: DateTime.fromISO('2020-08-28'),
    lastUpdatedAt: DateTime.fromISO('2020-11-30'),
    businessOwner: {
      name: 'Marny Land'
    },
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
    activities: [
      {
        id: 1,
        content: 'Status changed to Testing Complete',
        createdAt: DateTime.fromISO('2020-11-30'),
        type: ActivityType.StatusChanged,
        authorName: 'Aaron Allen'
      },
      {
        id: 2,
        content: 'Test Results uploaded - 70%',
        createdAt: DateTime.fromISO('2020-11-30'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 1,
        content: 'Status changed to Testing in progress',
        createdAt: DateTime.fromISO('2020-11-28'),
        type: ActivityType.StatusChanged,
        authorName: 'Aaron Allen'
      },
      {
        id: 2,
        content: 'Testing VPAT uploaded',
        createdAt: DateTime.fromISO('2020-11-21'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 3,
        content: 'Test plan uploaded',
        createdAt: DateTime.fromISO('2020-11-21'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 5,
        content: 'Awarded VPAT uploaded',
        createdAt: DateTime.fromISO('2020-10-29'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 6,
        content: 'Impact Analysis Network project created',
        createdAt: DateTime.fromISO('2020-08-28'),
        type: ActivityType.ProjectCreated,
        authorName: 'Aaron Allen'
      }
    ],

    lifecycleID: 'X200943'
  },
  3: {
    id: 3,
    name: 'Migration Pipeline',
    status: ProjectStatus.InRemediation,
    submissionDate: DateTime.fromISO('2020-07-16'),
    lastUpdatedAt: DateTime.fromISO('2020-10-03'),
    businessOwner: {
      name: 'Connie Leonard'
    },
    activities: [],
    documents: [],
    lifecycleID: 'X200943'
  },
  4: {
    id: 4,
    name: '(USDS) Dashboard for USDS',
    status: ProjectStatus.InRemediation,
    submissionDate: DateTime.fromISO('2020-05-21'),
    lastUpdatedAt: DateTime.fromISO('2020-09-14'),
    businessOwner: {
      name: 'Ada Sanchez'
    },
    activities: [],
    documents: [],
    lifecycleID: 'X200943'
  },
  5: {
    id: 5,
    name: 'OSORA FOIA Portal Project',
    status: ProjectStatus.InRemediation,
    submissionDate: DateTime.fromISO('2020-01-02'),
    lastUpdatedAt: DateTime.fromISO('2020-03-17'),
    businessOwner: {
      name: 'Amanda Johnson'
    },
    activities: [],
    documents: [],
    lifecycleID: 'X200943'
  }
};

export default projects;
