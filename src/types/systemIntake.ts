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
  projectName: string;
  acronym: string;
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
};

export type SaveSystemIntakeAction = {
  type: string;
  id: string;
  formData: SystemIntakeForm;
};

export type FetchSystemIntakesAction = {
  type: string;
};

export type StoreSystemIntakesAction = {
  type: string;
  systemIntakes: SystemIntakeForm[];
};
