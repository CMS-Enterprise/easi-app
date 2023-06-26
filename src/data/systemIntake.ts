import { DateTime } from 'luxon';

import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import {
  GovernanceCollaborationTeam,
  SystemIntakeForm
} from 'types/systemIntake';
import { cleanCSVData } from 'utils/csv';
import { formatContractDate, formatDateLocal, parseAsUTC } from 'utils/date';
// On the frontend, the field is now "requestName", but the backend API
// has it as "projectName". This was an update from design.
export const initialSystemIntakeForm: SystemIntakeForm = {
  id: '',
  euaUserId: '',
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
  existingFunding: null,
  fundingSources: [],
  annualSpending: {
    currentAnnualSpending: '',
    plannedYearOneSpending: ''
  },
  contract: {
    hasContract: '',
    contractor: '',
    number: '',
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
  lcidExpiresAt: null,
  lcidScope: '',
  decisionNextSteps: '',
  rejectionReason: '',
  grtDate: null,
  grbDate: null,
  adminLead: '',
  lastAdminNote: null,
  lcidCostBaseline: '',
  requesterNameAndComponent: '',
  hasUiChanges: null
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
    existingFunding: systemIntake.existingFunding,
    fundingSources: systemIntake.fundingSources,
    businessNeed: systemIntake.businessNeed,
    solution: systemIntake.businessSolution,
    processStatus: systemIntake.currentStage,
    eaSupportRequest: systemIntake.needsEaSupport,
    existingContract: systemIntake.contract.hasContract,
    grtReviewEmailBody: systemIntake.grtReviewEmailBody,
    contractor: systemIntake.contract.contractor,
    contractNumber: systemIntake.contract.number,
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
    grtDate: systemIntake.grtDate,
    grbDate: systemIntake.grbDate,
    submittedAt: systemIntake.submittedAt,
    adminLead: systemIntake.adminLead,
    hasUiChanges: systemIntake.hasUiChanges
  };
};

export const prepareSystemIntakeForApp = (
  systemIntake: any // TODO: Specify type
): SystemIntakeForm => {
  const governanceTeams = () => {
    const teams: GovernanceCollaborationTeam[] = [];
    cmsGovernanceTeams.forEach(team => {
      if (systemIntake[team.collaboratorKey]) {
        teams.push({
          collaborator: systemIntake[team.collaboratorKey],
          name: team.value,
          key: team.key
        });
      }
    });
    return teams;
  };

  const contractStartDate = parseAsUTC(systemIntake.contractStartDate);
  const contractEndDate = parseAsUTC(systemIntake.contractEndDate);

  return {
    id: systemIntake.id || '',
    euaUserId: systemIntake.euaUserId || '',
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
    existingFunding: systemIntake.existingFunding,
    fundingSources: systemIntake.fundingSources || [],
    annualSpending: {
      currentAnnualSpending: systemIntake.currentAnnualSpending || '',
      plannedYearOneSpending: systemIntake.plannedYearOneSpending || ''
    },
    contract: {
      hasContract: systemIntake.existingContract || '',
      contractor: systemIntake.contractor || '',
      number: systemIntake.contractNumber || '',
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
    decidedAt: systemIntake.decidedAt,
    businessCaseId: systemIntake.businessCase || null,
    submittedAt: systemIntake.submittedAt,
    updatedAt: systemIntake.updatedAt,
    createdAt: systemIntake.createdAt,
    archivedAt: systemIntake.archivedAt,
    lcid: systemIntake.lcid || '',
    lcidExpiresAt: systemIntake.lcidExpiresAt,
    lcidScope: systemIntake.lcidScope || '',
    decisionNextSteps: systemIntake.decisionNextSteps || '',
    rejectionReason: systemIntake.rejectionReason || '',
    grtDate: systemIntake.grtDate,
    grbDate: systemIntake.grbDate,
    adminLead: systemIntake.adminLead || '',
    lastAdminNote: systemIntake.lastAdminNoteContent
      ? {
          content: systemIntake.lastAdminNoteContent,
          createdAt: systemIntake.lastAdminNoteCreatedAt
        }
      : null,
    lcidCostBaseline: '',
    requesterNameAndComponent: '',
    hasUiChanges:
      systemIntake.hasUiChanges === null ? null : systemIntake.hasUiChanges
  };
};

export const convertIntakeToCSV = (
  intake: SystemIntakeForm & { requesterNameAndComponent: string }
) => {
  const collaboratorTeams: any = {};
  if (intake.governanceTeams.isPresent) {
    intake.governanceTeams.teams.forEach((team: any) => {
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

  return cleanCSVData({
    ...intake,
    ...collaboratorTeams,
    lastAdminNote: intake.lastAdminNote
      ? `${intake.lastAdminNote.content} (${formatDateLocal(
          intake.lastAdminNote.createdAt,
          'MMMM d, yyyy'
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
    submittedAt: intake.submittedAt,
    updatedAt: intake.updatedAt,
    createdAt: intake.createdAt,
    decidedAt: intake.decidedAt,
    archivedAt: intake.archivedAt
  });
};

/**
 * Check if any intake fields have been filled out
 */
export const isIntakeStarted = (intake: SystemIntake | SystemIntakeForm) => {
  /**
   * Ignore id, euaUserId, status, requester name/component/email
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
    (intake.governanceTeams.teams && intake.governanceTeams.teams.length > 0) ||
    intake.fundingSources.length > 0 ||
    intake.annualSpending?.currentAnnualSpending ||
    intake.annualSpending?.plannedYearOneSpending ||
    intake.contract.hasContract ||
    intake.contract.contractor ||
    intake.contract.number ||
    intake.contract.startDate.month ||
    intake.contract.startDate.year ||
    intake.contract.endDate.month ||
    intake.contract.endDate.year ||
    intake.businessNeed ||
    intake.businessSolution ||
    intake.currentStage ||
    intake.needsEaSupport ||
    intake.hasUiChanges
  );
};
