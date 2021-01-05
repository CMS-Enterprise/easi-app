import { DateTime } from 'luxon';

import { ProgressStatus } from './components/Progress';

export enum DocumentType {
  TestPlan = 'Testing Plan',
  TestingVPAT = 'Testing VPAT',
  TestResults = 'Test Results',
  AwardedVPAT = 'Awarded VPAT',
  RemediationPlan = 'Remediation Plan',
  Other = 'Other Document'
}

export type Document = {
  id: number;
  type: DocumentType;
  otherName?: string;
  mimetype: string;
  createdAt: DateTime;
  testDate?: DateTime;
  score?: number;
};

export type Person = {
  name: string;
  component: string;
};

export type Note = {
  id: number;
  authorName: string;
  content: string;
  createdAt: DateTime;
};

export enum RequestStep {
  RequestReceived = 'Request Received',
  DocumentsReceived = 'Documents Received',
  TestScheduled = 'Test Scheduled',
  RemediationRequested = 'Remediation Requested',
  RemediationInProgress = 'Remediation in Progress',
  ValidationTestingScheduled = 'Validation Testing Scheduled',
  Completed = 'Completed'
}

export type RequestStepStatus = {
  date: DateTime;
  status: ProgressStatus;
};

export type PastRequest = {
  name: string;
  release: string;
  lastTestDate: DateTime;
};

export type Project = {
  id: number;
  name: string;
  release?: string;
  status: RequestStep;
  businessOwner: Person;
  pointOfContact: Person;
  testDate?: DateTime;
  submissionDate: DateTime;
  remediationStartDate?: DateTime;
  lastUpdatedAt: DateTime;
  lifecycleID: string;
  description?: string;
  documents: Document[];
  notes: Note[];
  banner?: string;
  stepStatuses: { [index in RequestStep]?: RequestStepStatus };
  pastRequests: PastRequest[];
};
