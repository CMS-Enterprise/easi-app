import { DateTime } from 'luxon';

export type GovernanceCollaborationTeam = {
  collaborator: string;
  name: string;
};

export type SystemIntakeStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ACCEPTED'
  | 'APPROVED'
  | 'CLOSED';

/**
 * Type for SystemIntakeForm
 *
 */
export type SystemIntakeForm = {
  id: string;
  euaUserID: string;
  requestName: string;
  status: SystemIntakeStatus;
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
} & ContractDetailsForm;

export type ContractDetailsForm = {
  currentStage: string;
  hasContract: string;
  fundingSource: {
    isFunded: boolean | null;
    fundingNumber: string;
  };
  costs: {
    isExpectingIncrease: string;
    expectedIncreaseAmount: string;
  };
};

// Redux store type for a system intake
export type SystemIntakeState = {
  systemIntake: SystemIntakeForm;
  isLoading: boolean | null;
  isSaving: boolean;
  isSubmitting: boolean;
  error?: any;
};

// Redux store type for systems
export type SystemIntakesState = {
  systemIntakes: SystemIntakeForm[];
  isLoading: boolean | null;
  loadedTimestamp: DateTime | null;
  error: string | null;
};
