import {
  GovernanceCollaborationTeam,
  SystemIntakeForm
} from 'types/systemIntake';
import cmsGovernanceTeams from '../constants/enums/cmsGovernanceTeams';

export const initialSystemIntakeForm: SystemIntakeForm = {
  id: '',
  euaUserID: '',
  projectName: '',
  status: 'DRAFT',
  requester: {
    name: '',
    component: ''
  },
  businessOwner: {
    name: '',
    component: ''
  },
  productManager: {
    name: '',
    component: ''
  },
  isso: {
    isPresent: null,
    name: ''
  },
  governanceTeams: {
    isPresent: null,
    teams: []
  },
  fundingSource: {
    isFunded: null,
    fundingNumber: ''
  },
  businessNeed: '',
  businessSolution: '',
  currentStage: '',
  needsEaSupport: null,
  hasContract: ''
};

export const prepareSystemIntakeForApi = (systemIntake: SystemIntakeForm) => {
  const getGovernanceCollaborator = (name: string) => {
    const selectedTeam = systemIntake.governanceTeams.teams.find(
      team => team.name === name
    );

    return selectedTeam ? selectedTeam.collaborator : '';
  };

  return {
    id: systemIntake.id,
    status: systemIntake.status,
    requester: systemIntake.requester.name,
    component: systemIntake.requester.component,
    businessOwner: systemIntake.businessOwner.name,
    businessOwnerComponent: systemIntake.businessOwner.component,
    productManager: systemIntake.productManager.name,
    productManagerComponent: systemIntake.productManager.component,
    isso: systemIntake.isso.name,
    trbCollaborator: getGovernanceCollaborator('Technical Review Board'),
    oitSecurityCollaborator: getGovernanceCollaborator(
      "OIT's Security and Privacy Group"
    ),
    eaCollaborator: getGovernanceCollaborator('Enterprise Architecture'),
    projectName: systemIntake.projectName,
    existingFunding: systemIntake.fundingSource.isFunded,
    fundingSource: systemIntake.fundingSource.fundingNumber,
    businessNeed: systemIntake.businessNeed,
    solution: systemIntake.businessSolution,
    processStatus: systemIntake.currentStage,
    eaSupportRequest: systemIntake.needsEaSupport,
    existingContract: systemIntake.hasContract
  };
};

export const prepareSystemIntakeForApp = (systemIntake: any) => {
  const governanceTeams = () => {
    const teams: GovernanceCollaborationTeam[] = [];
    cmsGovernanceTeams.forEach(team => {
      if (systemIntake[team.collaboratorKey]) {
        teams.push({
          collaborator: systemIntake[team.collaboratorKey],
          name: team.value
        });
      }
    });
    return teams;
  };

  return {
    id: systemIntake.id || '',
    euaUserID: systemIntake.euaUserID || '',
    projectName: systemIntake.projectName || '',
    status: systemIntake.status || 'DRAFT',
    requester: {
      name: systemIntake.requester || '',
      component: systemIntake.component || ''
    },
    businessOwner: {
      name: systemIntake.businessOwner || '',
      component: systemIntake.businessOwnerComponent || ''
    },
    productManager: {
      name: systemIntake.productManager || '',
      component: systemIntake.productManagerComponent || ''
    },
    isso: {
      isPresent: !!systemIntake.isso || null,
      name: systemIntake.isso || ''
    },
    governanceTeams: {
      isPresent: governanceTeams().length !== 0 || null,
      teams: governanceTeams() || []
    },
    fundingSource: {
      isFunded: systemIntake.existingFunding || null,
      fundingNumber: systemIntake.fundingSource || ''
    },
    businessNeed: systemIntake.businessNeed || '',
    businessSolution: systemIntake.solution || '',
    currentStage: systemIntake.processStatus || '',
    needsEaSupport: systemIntake.eaSupportRequest || null,
    hasContract: systemIntake.existingContract || ''
  };
};
