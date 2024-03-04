import { DateTime } from 'luxon';

import { SystemIntakeForTable } from 'components/RequestRepository/tableMap';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import { SystemIntake } from 'queries/types/SystemIntake';
import { SystemIntakeStatusAdmin } from 'types/graphql-global-types';
import {
  GovernanceCollaborationTeam,
  SystemIntakeForm
} from 'types/systemIntake';
import convertBoolToYesNo from 'utils/convertBoolToYesNo';
import { cleanCSVData } from 'utils/csv';
import { formatDateLocal, parseAsUTC } from 'utils/date';
import extractTextContent from 'utils/extractTextContent';
// On the frontend, the field is now "requestName", but the backend API
// has it as "projectName". This was an update from design.
export const initialSystemIntakeForm: SystemIntakeForm = {
  id: '',
  euaUserId: '',
  requestName: '',
  statusAdmin: SystemIntakeStatusAdmin.INITIAL_REQUEST_FORM_IN_PROGRESS,
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
    currentAnnualSpendingITPortion: '',
    plannedYearOneSpending: '',
    plannedYearOneSpendingITPortion: ''
  },
  contract: {
    hasContract: '',
    contractor: '',
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
  lcidCostBaseline: '',
  requesterNameAndComponent: '',
  hasUiChanges: null,
  contractNumbers: []
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
    contractNumber: systemIntake.contractNumbers, // TODO(Sam): change `contractNumber` -> `contractNumbers`?
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
    statusAdmin: systemIntake.statusAdmin,
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
      currentAnnualSpendingITPortion:
        systemIntake.currentAnnualSpendingITPortion || '',
      plannedYearOneSpending: systemIntake.plannedYearOneSpending || '',
      plannedYearOneSpendingITPortion:
        systemIntake.plannedYearOneSpendingITPortion || ''
    },
    contract: {
      hasContract: systemIntake.existingContract || '',
      contractor: systemIntake.contractor || '',
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
    contractNumbers: systemIntake.contractNumbers || [],
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

    lcidCostBaseline: '',
    requesterNameAndComponent: '',
    hasUiChanges:
      systemIntake.hasUiChanges === null ? null : systemIntake.hasUiChanges
  };
};

export const convertIntakeToCSV = (intake: SystemIntakeForTable) => {
  const lastAdminNote = intake.lastAdminNote
    ? { ...intake.lastAdminNote }
    : null;

  // Apppend lastAdminNote createdAt date to content
  // Strip out html tags from content
  if (lastAdminNote) {
    lastAdminNote.content = `${extractTextContent(
      lastAdminNote.content
    )} (${formatDateLocal(lastAdminNote.createdAt, 'MM/dd/yyyy')})`;
  }

  // Format dates to MM/dd/yyyy
  const createdAt =
    intake?.createdAt && formatDateLocal(intake.createdAt, 'MM/dd/yyyy');
  const submittedAt =
    intake?.submittedAt && formatDateLocal(intake.submittedAt, 'MM/dd/yyyy');
  const updatedAt =
    intake?.updatedAt && formatDateLocal(intake.updatedAt, 'MM/dd/yyyy');
  const archivedAt =
    intake?.archivedAt && formatDateLocal(intake.archivedAt, 'MM/dd/yyyy');

  // Translate booleans to yes/no
  const existingFunding = convertBoolToYesNo(intake?.existingFunding);
  const needsEaSupport = convertBoolToYesNo(intake?.needsEaSupport);
  const hasUiChanges = convertBoolToYesNo(intake?.hasUiChanges);

  // Override all applicable fields with CSV formatting
  return cleanCSVData({
    ...intake,
    lastAdminNote,
    // Formatted booleans
    existingFunding,
    needsEaSupport,
    hasUiChanges,
    // Formatted dates
    createdAt,
    submittedAt,
    updatedAt,
    archivedAt
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
    intake.contractNumbers.length > 0 ||
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
