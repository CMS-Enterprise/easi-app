import { DateTime } from 'luxon';

export type GovernanceCollaborationTeam = {
  collaborator: string;
  name: string;
};

/**
 * Type for SystemIntakeForm
 *
 */
export type SystemIntakeForm = {
  id: string;
  euaUserID: string;
  requestName: string;
  status: string;
  requester: {
    name: string;
    component: string;
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
  fundingSource: {
    isFunded: boolean | null;
    fundingNumber: string;
  };
  businessNeed: string;
  businessSolution: string;
  currentStage: string;
  needsEaSupport: boolean | null;
  hasContract: string;
};

// Redux store type for a system intake
export type SystemIntakeState = {
  systemIntake?: SystemIntakeForm;
};

// Redux store type for systems
export type SystemIntakesState = {
  systemIntakes: SystemIntakeForm[];
  isLoading?: boolean;
  loadedTimestamp?: DateTime;
};

export type PutSystemIntakeAction = {
  type: string;
  id: string;
  formData: SystemIntakeForm;
};
