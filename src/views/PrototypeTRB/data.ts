import { DateTime } from 'luxon';

import { ActivityType, DocumentType, Project, ProjectStatus } from './types';

const projects: Record<string, Project> = {
  1: {
    id: 1,
    name: 'TACO',
    status: ProjectStatus.WaitingForFindings,
    submissionDate: DateTime.fromISO('2020-11-10'),
    lastUpdatedAt: DateTime.fromISO('2020-12-10'),
    businessOwner: {
      name: 'Shane Clark'
    },
    lifecycleID: 'X200943',
    documents: [
      {
        id: 2,
        type: DocumentType.ArchitectureDiagram,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-11-30')
      },
      {
        id: 3,
        type: DocumentType.Deck,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-11-30')
      }
    ],
    activities: [
      {
        id: 1,
        content: 'TACO project created',
        createdAt: DateTime.fromISO('2020-11-10'),
        type: ActivityType.ProjectCreated,
        authorName: 'Katrina Berkley'
      },
      {
        id: 2,
        content: 'Status changed to Review Requested',
        createdAt: DateTime.fromISO('2020-11-10'),
        type: ActivityType.StatusChanged,
        authorName: 'Katrina Berkley'
      },
      {
        id: 3,
        content: 'Status changed to In Consultation',
        createdAt: DateTime.fromISO('2020-11-25'),
        type: ActivityType.StatusChanged,
        authorName: 'Katrina Berkley'
      },
      {
        id: 4,
        content: 'Architecture Diagram uploaded',
        createdAt: DateTime.fromISO('2020-11-30'),
        type: ActivityType.DocumentAdded,
        authorName: 'Katrina Berkley'
      },
      {
        id: 5,
        content: 'Deck uploaded',
        createdAt: DateTime.fromISO('2020-11-30'),
        type: ActivityType.DocumentAdded,
        authorName: 'Katrina Berkley'
      },
      {
        id: 6,
        content: 'Status changed to In Design Review',
        createdAt: DateTime.fromISO('2020-12-04'),
        type: ActivityType.StatusChanged,
        authorName: 'Katrina Berkley'
      },
      {
        id: 7,
        content: 'Design review scheduled for 12/9',
        createdAt: DateTime.fromISO('2020-12-04'),
        type: ActivityType.NoteAdded,
        authorName: 'Katrina Berkley'
      },
      {
        id: 8,
        content: 'Status changed to Waiting for Findings',
        createdAt: DateTime.fromISO('2020-12-10'),
        type: ActivityType.StatusChanged,
        authorName: 'Katrina Berkley'
      }
    ],
    description:
      'TACO is a new tool for customers to access consolidated Active health information and facilitate the new Medicare process. The purpose is to provide a more integrated and unified customer service experience.'
  },
  2: {
    id: 2,
    name: 'Impact Analysis Network',
    status: ProjectStatus.InDesignReview,
    submissionDate: DateTime.fromISO('2020-11-06'),
    lastUpdatedAt: DateTime.fromISO('2020-12-04'),
    businessOwner: {
      name: 'Marny Land'
    },
    documents: [
      {
        id: 1,
        type: DocumentType.Deck,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-11-30'),
        score: 70
      },
      {
        id: 2,
        type: DocumentType.ArchitectureDiagram,
        mimetype: 'application/pdf',
        createdAt: DateTime.fromISO('2020-11-30')
      }
    ],
    activities: [
      {
        id: 1,
        content: 'Impact Analysis Network project created',
        createdAt: DateTime.fromISO('2020-11-06'),
        type: ActivityType.ProjectCreated,
        authorName: 'Katrina Berkley'
      },
      {
        id: 2,
        content: 'Status changed to Review Requested',
        createdAt: DateTime.fromISO('2020-11-06'),
        type: ActivityType.StatusChanged,
        authorName: 'Katrina Berkley'
      },
      {
        id: 3,
        content: 'Status changed to In Consultation',
        createdAt: DateTime.fromISO('2020-11-12'),
        type: ActivityType.StatusChanged,
        authorName: 'Katrina Berkley'
      },
      {
        id: 4,
        content: 'Architecture Diagram uploaded',
        createdAt: DateTime.fromISO('2020-11-30'),
        type: ActivityType.DocumentAdded,
        authorName: 'Katrina Berkley'
      },
      {
        id: 5,
        content: 'Deck uploaded',
        createdAt: DateTime.fromISO('2020-11-30'),
        type: ActivityType.DocumentAdded,
        authorName: 'Katrina Berkley'
      },
      {
        id: 6,
        content: 'Status changed to In Design Review',
        createdAt: DateTime.fromISO('2020-12-04'),
        type: ActivityType.StatusChanged,
        authorName: 'Katrina Berkley'
      },
      {
        id: 7,
        content: 'Design review scheduled for 12/9',
        createdAt: DateTime.fromISO('2020-12-04'),
        type: ActivityType.NoteAdded,
        authorName: 'Katrina Berkley'
      },
      {
        id: 8,
        content: 'Documents need review ahead of the session',
        createdAt: DateTime.fromISO('2020-12-04'),
        type: ActivityType.NoteAdded,
        authorName: 'Katrina Berkley'
      }
    ],

    lifecycleID: 'X200943'
  },
  3: {
    id: 3,
    name: 'Migration Pipeline',
    status: ProjectStatus.InConsultation,
    submissionDate: DateTime.fromISO('2020-11-24'),
    lastUpdatedAt: DateTime.fromISO('2020-11-28'),
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
    status: ProjectStatus.ReviewRequested,
    submissionDate: DateTime.fromISO('2020-12-01'),
    lastUpdatedAt: DateTime.fromISO('2020-12-01'),
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
    status: ProjectStatus.Closed,
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
