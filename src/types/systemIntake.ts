export type GovernanceCollaborationTeam = {
  collaborator: string;
  name: string;
};

/**
 * Type for SystemIntakeForm
 *
 */
export type SystemIntakeForm = {
  name: string;
  acronym: string;
  requestor: {
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
  description: string;
  currentStage: string;
  needsEaSupport: boolean | null;
  hasContract: string;
};
