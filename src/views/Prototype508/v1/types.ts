import { DateTime } from 'luxon';

export enum DocumentType {
  TestPlan = 'Testing Plan',
  TestingVPAT = 'Testing VPAT',
  TestResults = 'Test Results',
  AwardedVPAT = 'Awarded VPAT',
  RemediationPlan = 'Remediation Plan'
}

export type Document = {
  id: number;
  type: DocumentType;
  mimetype: string;
  createdAt: DateTime;
  score?: number;
};

export enum ProjectStatus {
  ConsultRequested = 'Consult Requested',
  TestingRequested = 'Testing Requested',
  TestingInProgress = 'Testing in Progress',
  TestingCompleted = 'Testing Completed',
  InRemediation = 'In Remediation'
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
