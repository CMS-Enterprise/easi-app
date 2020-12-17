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

export type Person = {
  name: string;
  component: string;
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

export enum RequestStatus {
  RequestReceived = 'Request Received',
  DocumentsReceived = 'Documents Received',
  TestScheduled = 'Test Scheduled',
  InRemediation = 'In Remediation',
  Completed = 'Completed'
}

export type Project = {
  id: number;
  name: string;
  status: RequestStatus;
  businessOwner: Person;
  pointOfContact: Person;
  testDate?: DateTime;
  submissionDate: DateTime;
  remediationStartDate?: DateTime;
  lastUpdatedAt: DateTime;
  lifecycleID: string;
  description?: string;
  documents: Document[];
  activities: Activity[];
  banner?: string;
};
