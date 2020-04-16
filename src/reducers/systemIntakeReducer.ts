import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import { STORE_SYSTEM_INTAKE } from '../constants/actions';
import {
  SystemIntakeState,
  SystemIntakeForm,
  GovernanceCollaborationTeam
} from '../types/systemIntake';

const initialState: SystemIntakeState = {};

function systemIntakeReducer(state = initialState, action: any): any {
  let systemIntake: SystemIntakeForm = {
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
  if (action.systemIntake) {
    const governanceTeams = () => {
      const teams: GovernanceCollaborationTeam[] = [];
      cmsGovernanceTeams.forEach(team => {
        if (action.systemIntake[team.apiKey]) {
          teams.push({
            collaborator: action.systemIntake[team.apiKey],
            name: team.value
          });
        }
      });
      return teams;
    };

    systemIntake = {
      id: action.systemIntake.id || '',
      euaUserID: action.systemIntake.euaUserID || '',
      projectName: action.systemIntake.name || '',
      status: action.systemIntake.status || 'DRAFT',
      requester: {
        name: action.systemIntake.requester || '',
        component: action.systemIntake.component || ''
      },
      businessOwner: {
        name: action.systemIntake.businessOwner || '',
        component: action.systemIntake.businessOwnerComponent || ''
      },
      productManager: {
        name: action.systemIntake.productManager || '',
        component: action.systemIntake.productManagerComponent || ''
      },
      isso: {
        isPresent: !!action.systemIntake.isso || null,
        name: action.systemIntake.isso || ''
      },
      governanceTeams: {
        isPresent: governanceTeams().length === 0,
        teams: governanceTeams() || []
      },
      fundingSource: {
        isFunded: action.systemIntake.existingFunding || null,
        fundingNumber: action.systemIntake.fundingSource || ''
      },
      businessNeed: action.systemIntake.businessNeed || '',
      businessSolution: action.systemIntake.businessSolution || '',
      currentStage: action.systemIntake.processStatus || '',
      needsEaSupport: action.systemIntake.eaSupportRequest || null,
      hasContract: action.systemIntake.existingContract || ''
    };
  }
  switch (action.type) {
    case STORE_SYSTEM_INTAKE:
      return {
        ...state,
        systemIntake
      };
    default:
      return state;
  }
}

export default systemIntakeReducer;
