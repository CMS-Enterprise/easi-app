import { SystemIntakeForTable } from 'components/RequestRepository/tableMap';
import { SystemIntakeStatusAdmin } from 'types/graphql-global-types';
import { SystemIntakeForm } from 'types/systemIntake';
import convertBoolToYesNo from 'utils/convertBoolToYesNo';
import { cleanCSVData } from 'utils/csv';
import { formatDateLocal } from 'utils/date';
import extractTextContent from 'utils/extractTextContent';
import formatContractNumbers from 'utils/formatContractNumbers';
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
    hasContract: null,
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
    },
    numbers: ''
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
  hasUiChanges: null
};

export const convertIntakeToCSV = (intake: SystemIntakeForTable) => {
  const lastAdminNote = intake.lastAdminNote
    ? { ...intake.lastAdminNote }
    : null;

  // Append lastAdminNote createdAt date to content
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
  const usesAiTech = convertBoolToYesNo(intake?.usesAiTech);
  const needsEaSupport = convertBoolToYesNo(intake?.needsEaSupport);
  const hasUiChanges = convertBoolToYesNo(intake?.hasUiChanges);

  const contractNumber = formatContractNumbers(intake.contractNumbers);
  const cmsSystem = intake.systems.map(v => v.name).join(', ');

  // Override all applicable fields with CSV formatting
  return cleanCSVData({
    ...intake,
    contractName: intake.contractName || '',
    contractNumber,
    cmsSystem,
    lastAdminNote,
    // Formatted booleans
    existingFunding,
    usesAiTech,
    needsEaSupport,
    hasUiChanges,
    // Formatted dates
    createdAt,
    submittedAt,
    updatedAt,
    archivedAt
  });
};
