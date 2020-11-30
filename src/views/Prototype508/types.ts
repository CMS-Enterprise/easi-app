import { DateTime } from 'luxon';

export enum DocumentType {
  TestPlan,
  TestingVPAT,
  TestResults,
  AwardedVPAT,
  RemediationPlan
}

export type Document = {
  type: DocumentType;
  mimetype: string;
  createdAt: DateTime;
};

export enum ProjectStatus {
  ConsultRequested,
  TestingRequested,
  TestingInProgress,
  TestingCompleted,
  InRemediation
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
};
