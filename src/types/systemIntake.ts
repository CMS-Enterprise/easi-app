export type GovernanceCollaborationTeam = {
  collaborator: string;
  name: string;
};

/**
 * Type for SystemIntakeForm
 *
 */
export type SystemIntakeForm = {
  projectName: string;
  acronym: string;
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
