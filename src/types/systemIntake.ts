import { DateTime } from 'luxon';

export type GovernanceCollaborationTeam = {
  collaborator: string;
  name: string;
};

export const openIntakeStatuses = [
  'INTAKE_DRAFT',
  'INTAKE_SUBMITTED',
  'NEED_BIZ_CASE',
  'BIZ_CASE_DRAFT',
  'BIZ_CASE_DRAFT_SUBMITTED',
  'BIZ_CASE_CHANGES_NEEDED',
  'BIZ_CASE_FINAL_NEEDED',
  'BIZ_CASE_FINAL_SUBMITTED',
  'READY_FOR_GRT',
  'READY_FOR_GRB',
  'SHUTDOWN_IN_PROGRESS'
];

export const closedIntakeStatuses = [
  'LCID_ISSUED',
  'WITHDRAWN',
  'NOT_IT_REQUEST',
  'NOT_APPROVED',
  'NO_GOVERNANCE',
  'SHUTDOWN_COMPLETE'
];

export const intakeStatuses = [
  ...openIntakeStatuses,
  ...closedIntakeStatuses
] as const;

// TODO: Remove old intake statuses once they're deprecated
export type SystemIntakeStatus = typeof intakeStatuses[number];

export type RequestType = 'NEW' | 'MAJOR_CHANGES' | 'RECOMPETE' | 'SHUTDOWN';

/**
 * Type for SystemIntakeForm
 *
 */
export type SystemIntakeForm = {
  id: string;
  euaUserID: string;
  requestName: string;
  status: SystemIntakeStatus;
  requestType: RequestType;
  requester: {
    name: string;
    component: string;
    email: string;
  };
  businessOwner: {
    name: string;
    component: string;
  };
  productManager: {
    name: string;
    component: string;
  };
  isso: {
    isPresent: boolean | null;
    name: string;
  };
  governanceTeams: {
    isPresent: boolean | null;
    teams: GovernanceCollaborationTeam[];
  };
  businessNeed: string;
  businessSolution: string;
  currentStage: string;
  needsEaSupport: boolean | null;
  grtReviewEmailBody: string;
  decidedAt: DateTime | null;
  businessCaseId?: string | null;
  submittedAt: DateTime | null;
  updatedAt: DateTime | null;
  createdAt: DateTime | null;
  archivedAt: DateTime | null;
  lcid: string;
  lcidExpiration: DateTime | null;
  lcidScope: string;
  decisionNextSteps: string;
  rejectionReason: string;
  grtDate: DateTime | null;
  grbDate: DateTime | null;
} & ContractDetailsForm;

export type ContractDetailsForm = {
  currentStage: string;
  fundingSource: {
    isFunded: boolean | null;
    fundingNumber: string;
    source: string;
  };
  costs: {
    isExpectingIncrease: string;
    expectedIncreaseAmount: string;
  };
  contract: {
    hasContract: string;
    contractor: string;
    vehicle: string;
    startDate: {
      month: string;
      year: string;
    };
    endDate: {
      month: string;
      year: string;
    };
  };
};

export type IntakeNote = {
  id: string;
  authorName: string;
  authorId: string;
  content: string;
  systemIntakeId: string;
  createdAt: DateTime;
};

// Redux store type for a system intake
export type SystemIntakeState = {
  systemIntake: SystemIntakeForm;
  isLoading: boolean | null;
  isSaving: boolean;
  isNewIntakeCreated: boolean | null;
  error?: any;
  notes: IntakeNote[];
};

// Redux store type for systems
export type SystemIntakesState = {
  systemIntakes: SystemIntakeForm[];
  isLoading: boolean | null;
  loadedTimestamp: DateTime | null;
  error: string | null;
};

// Form for reviewer to add dates
export type SubmitDatesForm = {
  grtDateDay: string;
  grtDateMonth: string;
  grtDateYear: string;
  grbDateDay: string;
  grbDateMonth: string;
  grbDateYear: string;
};
