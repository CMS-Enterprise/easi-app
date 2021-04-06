import { DateTime } from 'luxon';

import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import {
  GovernanceCollaborationTeam,
  SystemIntakeForm
} from 'types/systemIntake';
import { formatContractDate, formatDate, parseDate } from 'utils/date';

// On the frontend, the field is now "requestName", but the backend API
// has it as "projectName". This was an update from design.
export const initialSystemIntakeForm: SystemIntakeForm = {
  id: '',
  euaUserID: '',
  requestName: '',
  status: 'INTAKE_DRAFT',
  requestType: 'NEW',
  requester: {
    name: '',
    component: '',
    email: ''
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
    fundingNumber: '',
    source: ''
  },
  costs: {
    isExpectingIncrease: '',
    expectedIncreaseAmount: ''
  },
  contract: {
    hasContract: '',
    contractor: '',
    vehicle: '',
    startDate: {
      month: '',
      day: '',
      year: ''
    },
    endDate: {
      month: '',
      day: '',
      year: ''
    }
  },
  businessNeed: '',
  businessSolution: '',
  currentStage: '',
  needsEaSupport: null,
  grtReviewEmailBody: '',
  decidedAt: null,
  businessCaseId: null,
  submittedAt: null,
  updatedAt: null,
  createdAt: null,
  archivedAt: null,
  lcid: '',
  lcidExpiration: null,
  lcidScope: '',
  decisionNextSteps: '',
  rejectionReason: '',
  grtDate: null,
  grbDate: null,
  adminLead: '',
  lastAdminNote: null
};

export const prepareSystemIntakeForApi = (systemIntake: SystemIntakeForm) => {
  const getGovernanceCollaborator = (name: string) => {
    const selectedTeam = systemIntake.governanceTeams.teams.find(
      team => team.name === name
    );

    return selectedTeam ? selectedTeam.collaborator : '';
  };

  return {
    ...(systemIntake.id && {
      id: systemIntake.id
    }),
    status: systemIntake.status,
    requestType: systemIntake.requestType,
    requester: systemIntake.requester.name,
    component: systemIntake.requester.component,
    businessOwner: systemIntake.businessOwner.name,
    businessOwnerComponent: systemIntake.businessOwner.component,
    productManager: systemIntake.productManager.name,
    productManagerComponent: systemIntake.productManager.component,
    issoName: systemIntake.isso.name,
    trbCollaboratorName: getGovernanceCollaborator('Technical Review Board'),
    oitSecurityCollaboratorName: getGovernanceCollaborator(
      "OIT's Security and Privacy Group"
    ),
    eaCollaboratorName: getGovernanceCollaborator('Enterprise Architecture'),
    projectName: systemIntake.requestName,
    existingFunding: systemIntake.fundingSource.isFunded,
    fundingNumber: systemIntake.fundingSource.fundingNumber,
    fundingSource: systemIntake.fundingSource.source,
    businessNeed: systemIntake.businessNeed,
    solution: systemIntake.businessSolution,
    processStatus: systemIntake.currentStage,
    eaSupportRequest: systemIntake.needsEaSupport,
    existingContract: systemIntake.contract.hasContract,
    grtReviewEmailBody: systemIntake.grtReviewEmailBody,
    costIncrease: systemIntake.costs.isExpectingIncrease,
    costIncreaseAmount: systemIntake.costs.expectedIncreaseAmount,
    contractor: systemIntake.contract.contractor,
    contractVehicle: systemIntake.contract.vehicle,
    contractStartDate: DateTime.fromObject({
      day: Number(systemIntake.contract.startDate.day),
      month: Number(systemIntake.contract.startDate.month),
      year: Number(systemIntake.contract.startDate.year)
    }),
    contractEndDate: DateTime.fromObject({
      day: Number(systemIntake.contract.endDate.day),
      month: Number(systemIntake.contract.endDate.month),
      year: Number(systemIntake.contract.endDate.year)
    }),
    grtDate: systemIntake.grtDate && systemIntake.grtDate.toISO(),
    grbDate: systemIntake.grbDate && systemIntake.grbDate.toISO(),
    submittedAt: systemIntake.submittedAt && systemIntake.submittedAt.toISO(),
    adminLead: systemIntake.adminLead
  };
};

export const prepareSystemIntakeForApp = (
  systemIntake: any
): SystemIntakeForm => {
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

  const contractStartDate = DateTime.fromISO(systemIntake.contractStartDate);
  const contractEndDate = DateTime.fromISO(systemIntake.contractEndDate);

  return {
    id: systemIntake.id || '',
    euaUserID: systemIntake.euaUserID || '',
    requestName: systemIntake.projectName || '',
    status: systemIntake.status || 'INTAKE_DRAFT',
    requestType: systemIntake.requestType || 'NEW',
    requester: {
      name: systemIntake.requester || '',
      component: systemIntake.component || '',
      email: systemIntake.requesterEmailAddress || ''
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
      isPresent: !!systemIntake.issoName || null,
      name: systemIntake.issoName || ''
    },
    governanceTeams: {
      isPresent: governanceTeams().length !== 0 || null,
      teams: governanceTeams() || []
    },
    fundingSource: {
      isFunded:
        systemIntake.existingFunding === null
          ? null
          : systemIntake.existingFunding,
      fundingNumber: systemIntake.fundingNumber || '',
      source: systemIntake.fundingSource || ''
    },
    costs: {
      isExpectingIncrease: systemIntake.costIncrease || '',
      expectedIncreaseAmount: systemIntake.costIncreaseAmount || ''
    },
    contract: {
      hasContract: systemIntake.existingContract || '',
      contractor: systemIntake.contractor || '',
      vehicle: systemIntake.contractVehicle || '',
      startDate: {
        month: contractStartDate.month
          ? contractStartDate.month.toString()
          : systemIntake.contractStartMonth || '',
        day: contractStartDate.day ? contractStartDate.day.toString() : '',
        year: contractStartDate.year
          ? contractStartDate.year.toString()
          : systemIntake.contractStartYear || ''
      },
      endDate: {
        month: contractEndDate.month
          ? contractEndDate.month.toString()
          : systemIntake.contractEndMonth || '',
        day: contractEndDate.day ? contractEndDate.day.toString() : '',
        year: contractEndDate.year
          ? contractEndDate.year.toString()
          : systemIntake.contractEndYear || ''
      }
    },
    businessNeed: systemIntake.businessNeed || '',
    businessSolution: systemIntake.solution || '',
    currentStage: systemIntake.processStatus || '',
    needsEaSupport:
      systemIntake.eaSupportRequest === null
        ? null
        : systemIntake.eaSupportRequest,
    grtReviewEmailBody: systemIntake.grtReviewEmailBody || '',
    decidedAt: systemIntake.decidedAt
      ? DateTime.fromISO(systemIntake.decidedAt)
      : null,
    businessCaseId: systemIntake.businessCase || null,
    submittedAt: systemIntake.submittedAt
      ? DateTime.fromISO(systemIntake.submittedAt)
      : null,
    updatedAt: systemIntake.updatedAt
      ? DateTime.fromISO(systemIntake.updatedAt)
      : null,
    createdAt: systemIntake.createdAt
      ? DateTime.fromISO(systemIntake.createdAt)
      : null,
    archivedAt: systemIntake.archivedAt
      ? DateTime.fromISO(systemIntake.archivedAt)
      : null,
    lcid: systemIntake.lcid || '',
    lcidExpiration: systemIntake.lcidExpiresAt
      ? DateTime.fromISO(systemIntake.lcidExpiresAt)
      : null,
    lcidScope: systemIntake.lcidScope || '',
    decisionNextSteps: systemIntake.decisionNextSteps || '',
    rejectionReason: systemIntake.rejectionReason || '',
    grtDate: systemIntake.grtDate ? parseDate(systemIntake.grtDate) : null,
    grbDate: systemIntake.grbDate ? parseDate(systemIntake.grbDate) : null,
    adminLead: systemIntake.adminLead || '',
    lastAdminNote: systemIntake.lastAdminNoteContent
      ? {
          content: systemIntake.lastAdminNoteContent,
          createdAt: systemIntake.lastAdminNoteCreatedAt
        }
      : null
  };
};

export const convertIntakeToCSV = (intake: SystemIntakeForm) => {
  const collaboratorTeams: any = {};
  if (intake.governanceTeams.isPresent) {
    intake.governanceTeams.teams.forEach(team => {
      switch (team.name) {
        case 'Technical Review Board':
          collaboratorTeams.trbCollaborator = team.collaborator;
          break;
        case "OIT's Security and Privacy Group":
          collaboratorTeams.oitCollaborator = team.collaborator;
          break;
        case 'Enterprise Architecture':
          collaboratorTeams.eaCollaborator = team.collaborator;
          break;
        default:
          break;
      }
    });
  }

  return {
    ...intake,
    ...collaboratorTeams,
    lastAdminNote: intake.lastAdminNote
      ? `${intake.lastAdminNote.content} (${formatDate(
          intake.lastAdminNote.createdAt
        )})`
      : null,
    lcidScope: intake.lcidScope,
    contractStartDate: ['HAVE_CONTRACT', 'IN_PROGRESS'].includes(
      intake.contract.hasContract
    )
      ? formatContractDate(intake.contract.startDate)
      : '',
    contractEndDate: ['HAVE_CONTRACT', 'IN_PROGRESS'].includes(
      intake.contract.hasContract
    )
      ? formatContractDate(intake.contract.endDate)
      : '',
    submittedAt: intake.submittedAt && intake.submittedAt.toISO(),
    updatedAt: intake.updatedAt && intake.updatedAt.toISO(),
    createdAt: intake.createdAt && intake.createdAt.toISO(),
    decidedAt: intake.decidedAt && intake.decidedAt.toISO(),
    archivedAt: intake.archivedAt && intake.archivedAt.toISO()
  };
};

/**
 * Check if any intake fields have been filled out
 */
export const isIntakeStarted = (intake: SystemIntakeForm) => {
  /**
   * Ignore id, euaUserID, status, requester name/component/email
   * because those are generated by default.
   */
  return !!(
    intake.requestName ||
    intake.requester.component ||
    intake.businessOwner.name ||
    intake.businessOwner.component ||
    intake.productManager.name ||
    intake.productManager.component ||
    intake.isso.isPresent ||
    intake.isso.name ||
    intake.governanceTeams.isPresent ||
    intake.governanceTeams.teams.length > 0 ||
    intake.fundingSource.isFunded ||
    intake.fundingSource.fundingNumber ||
    intake.fundingSource.source ||
    intake.costs.isExpectingIncrease ||
    intake.costs.expectedIncreaseAmount ||
    intake.contract.hasContract ||
    intake.contract.contractor ||
    intake.contract.vehicle ||
    intake.contract.startDate.month ||
    intake.contract.startDate.year ||
    intake.contract.endDate.month ||
    intake.contract.endDate.year ||
    intake.businessNeed ||
    intake.businessSolution ||
    intake.currentStage ||
    intake.needsEaSupport
  );
};
