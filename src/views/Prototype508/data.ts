import { DateTime } from 'luxon';

import { ActivityType, DocumentType, Project, ProjectStatus } from './types';

const projects: Project[] = [
  {
    id: 1,
    name: 'TACO',
    status: ProjectStatus.ConsultRequested,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Shane Clark'
    },
    lifecycleID: 'X200943',
    documents: [
      {
        type: DocumentType.TestResults,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-02-19'),
        score: 70
      },
      {
        type: DocumentType.AwardedVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-02-09')
      },
      {
        type: DocumentType.TestPlan,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-02-10')
      },
      {
        type: DocumentType.AwardedVPAT,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-02-11')
      }
    ],
    activities: [
      {
        id: 1,
        content: 'Status changed to Testing in progress',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.StatusChanged,
        authorName: 'Aaron Allen'
      },
      {
        id: 2,
        content: 'VPAT uploaded',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 3,
        content: 'Test plan uploaded',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 4,
        content:
          'We are waiting on the test plan and VPAT from business owner.',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.NoteAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 5,
        content: 'Awarded VPAT uploaded',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.DocumentAdded,
        authorName: 'Aaron Allen'
      },
      {
        id: 6,
        content: 'TACO project created',
        createdAt: DateTime.fromISO('2020-02-09'),
        type: ActivityType.ProjectCreated,
        authorName: 'Aaron Allen'
      }
    ],
    description:
      'TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience.'
  },
  {
    id: 2,
    name: 'Impact Analysis Network',
    status: ProjectStatus.TestingRequested,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Shane Clark'
    },
    activities: [],
    documents: [],
    lifecycleID: 'X200943'
  },
  {
    id: 3,
    name: 'Migration Pipeline',
    status: ProjectStatus.TestingInProgress,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Connie Leonard'
    },
    activities: [],
    documents: [],
    lifecycleID: 'X200943'
  },
  {
    id: 4,
    name: '(USDS) Dashboard for USDS',
    status: ProjectStatus.TestingCompleted,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Ada Sanchez'
    },
    activities: [],
    documents: [],
    lifecycleID: 'X200943'
  },
  {
    id: 5,
    name: 'OSORA FOIA Portal Project',
    status: ProjectStatus.InRemediation,
    submissionDate: DateTime.fromISO('2020-03-21'),
    lastUpdatedAt: DateTime.fromISO('2020-05-17'),
    businessOwner: {
      name: 'Amanda Johnson'
    },
    activities: [],
    documents: [],
    lifecycleID: 'X200943'
  }
];

export default projects;
