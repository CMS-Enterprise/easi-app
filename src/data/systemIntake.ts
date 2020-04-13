import { SystemIntakeForm } from 'types/systemIntake';

export const prepareSystemIntakeForApi = (
  id: string,
  systemIntake: SystemIntakeForm
) => {
  const getGovernanceCollaborator = (name: string) => {
    const selectedTeam = systemIntake.governanceTeams.teams.find(
      team => team.name === name
    );

    return selectedTeam ? selectedTeam.collaborator : '';
  };

  return {
    id,
    requester: systemIntake.requester.name,
    component: systemIntake.requester.component,
    business_owner: systemIntake.businessOwner.name,
    business_owner_component: systemIntake.businessOwner.component,
    product_manager: systemIntake.productManager.name,
    product_manager_component: systemIntake.productManager.component,
    isso: systemIntake.isso.name,
    trb_collaborator: getGovernanceCollaborator('Technical Review Board'),
    oit_security_collaborator: getGovernanceCollaborator(
      "OIT's Security and Privacy Group"
    ),
    ea_collaborator: getGovernanceCollaborator('Enterprise Architecture'),
    project_name: systemIntake.projectName,
    existing_funding: systemIntake.fundingSource.isFunded,
    funding_source: systemIntake.fundingSource.fundingNumber,
    business_need: systemIntake.businessNeed,
    solution: systemIntake.businessSolution,
    process_status: systemIntake.currentStage,
    ea_support_request: systemIntake.needsEaSupport,
    existing_contract: systemIntake.hasContract
  };
};

export const prepareSystemIntakeForApp = () => {};
