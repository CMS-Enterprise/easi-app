import { DateTime } from 'luxon';

export enum DocumentType {
  FindingsLetter = 'Findings Letter',
  ArchitectureDiagram = 'Architecture Diagram',
  Deck = 'Deck'
}

export type Document = {
  id: number;
  type: DocumentType;
  mimetype: string;
  createdAt: DateTime;
  score?: number;
};

export enum ProjectStatus {
  ReviewRequested = 'Review Requested',
  InConsultation = 'In Consultation',
  InDesignReview = 'In Design Review',
  InOperationalReadiness = 'In Operational Readiness',
  WaitingForFindings = 'Waiting for Findings',
  Closed = 'Closed'
}

export type BusinessOwner = {
  name: string;
};

export enum ActivityType {
  NoteAdded,
  StatusChanged,
  DocumentAdded,
  DocumentRemoved,
  ProjectCreated
}

export type Activity = {
  id: number;
  authorName: string;
  content: string;
  createdAt: DateTime;
  type: ActivityType;
};

export type Project = {
  id: number;
  name: string;
  status: ProjectStatus;
  businessOwner: BusinessOwner;
  submissionDate: DateTime;
  lastUpdatedAt: DateTime;
  lifecycleID: string;
  description?: string;
  documents: Document[];
  activities: Activity[];
  banner?: string;
};
