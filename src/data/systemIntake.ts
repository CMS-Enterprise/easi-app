import {
  ITGovIntakeFormStatus,
  SystemIntakeContactComponent,
  SystemIntakeLCIDType,
  SystemIntakeStatusAdmin
} from 'gql/generated/graphql';
import i18next from 'i18next';

import { SystemIntakeForTable } from 'components/RequestRepository/tableMap';
import { getComponentByEnum } from 'constants/cmsComponentsMap';
import { SystemIntakeForm } from 'types/systemIntake';
import convertBoolToYesNo from 'utils/convertBoolToYesNo';
import { formatDateLocal } from 'utils/date';
import extractTextContent from 'utils/extractTextContent';
import formatContractNumbers from 'utils/formatContractNumbers';
// On the frontend, the field is now "requestName", but the backend API
// has it as "projectName". This was an update from design.
export const initialSystemIntakeForm: SystemIntakeForm = {
  id: '',
  euaUserId: '',
  requestName: '',
  projectAcronym: '',
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
  governanceTeams: {
    isPresent: null,
    teams: []
  },
  existingFunding: null,
  fundingSources: [],
  totalContractCosts: {
    currentEstimatedCost: '',
    currentEstimatedCostITPortion: '',
    estimatedTotalContractValue: '',
    estimatedTotalContractValueITPortion: ''
  },
  contract: {
    hasContract: null,
    contractor: '',
    startDate: '',
    endDate: '',
    numbers: ''
  },
  itGovTaskStatuses: {
    intakeFormStatus: ITGovIntakeFormStatus.READY
  },
  businessNeed: '',
  businessSolution: '',
  currentStage: '',
  needsEaSupport: null,
  digitalServiceInteraction: null,
  digitalServiceInteractionDescription: '',
  protectedCmsDataAccessedOutside: null,
  protectedCmsDataAccessedOutsideDescription: '',
  grtReviewEmailBody: '',
  decidedAt: null,
  businessCaseId: null,
  submittedAt: null,
  updatedAt: null,
  createdAt: null,
  archivedAt: null,
  lcid: '',
  lcidIssuedAt: null,
  lcidExpiresAt: null,
  lcidScope: '',
  decisionNextSteps: '',
  rejectionReason: '',
  grtDate: null,
  grbDate: null,
  adminLead: '',
  lcidCostBaseline: '',
  requesterNameAndComponent: '',
  usesAiTech: null,
  usingSoftware: null,
  acquisitionMethods: [],
  hasUiChanges: null
};

const formatLCIDType = (lcidType: SystemIntakeLCIDType | null | undefined) => {
  return lcidType ? i18next.t(`action:issueLCID.lcidType.${lcidType}`) : '';
};

const formatLCIDComponent = (
  lcidComponent: SystemIntakeContactComponent | null | undefined
) => {
  if (!lcidComponent) return '';

  const component = getComponentByEnum(lcidComponent);
  return component.acronym || lcidComponent;
};

export const prepareIntakeToCSV = (intake: SystemIntakeForTable) => {
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
  const lcidIssuedAt =
    intake?.lcidIssuedAt && formatDateLocal(intake.lcidIssuedAt, 'MM/dd/yyyy');
  const lcidExpiresAt =
    intake?.lcidExpiresAt &&
    formatDateLocal(intake.lcidExpiresAt, 'MM/dd/yyyy');

  // Translate booleans to yes/no
  const existingFunding = convertBoolToYesNo(intake?.existingFunding);
  const usesAiTech = convertBoolToYesNo(intake?.usesAiTech);
  const needsEaSupport = convertBoolToYesNo(intake?.needsEaSupport);
  const digitalServiceInteraction = intake?.digitalServiceInteraction;
  const digitalServiceInteractionDescription =
    intake?.digitalServiceInteractionDescription;
  const protectedCmsDataAccessedOutside =
    intake?.protectedCmsDataAccessedOutside;
  const protectedCmsDataAccessedOutsideDescription =
    intake?.protectedCmsDataAccessedOutsideDescription;
  const hasUiChanges = convertBoolToYesNo(intake?.hasUiChanges);
  const usingSoftware = intake?.usingSoftware;
  const acquisitionMethods = intake?.acquisitionMethods;
  const lcidType = formatLCIDType(intake?.lcidType);
  const lcidComponent = formatLCIDComponent(intake?.lcidComponent);
  const lcidIsLowIt = convertBoolToYesNo(intake?.lcidIsLowIt);
  const lcidIsShortened = convertBoolToYesNo(intake?.lcidIsShortened);
  const status =
    intake.lcid && intake.lcidDisplay
      ? intake.status.replace(intake.lcidDisplay, intake.lcid)
      : intake.status;

  const contractNumber = formatContractNumbers(intake.contractNumbers);
  const cmsSystem = intake.systems.map(v => v.name).join(', ');

  return {
    ...intake,
    contractName: intake.contractName || '',
    contractNumber,
    cmsSystem,
    lastAdminNote,
    status,
    // Formatted booleans
    existingFunding,
    usesAiTech,
    needsEaSupport,
    digitalServiceInteraction,
    digitalServiceInteractionDescription,
    protectedCmsDataAccessedOutside,
    protectedCmsDataAccessedOutsideDescription,
    hasUiChanges,
    usingSoftware,
    acquisitionMethods,
    lcidType,
    lcidComponent,
    lcidIsLowIt,
    lcidIsShortened,
    // Formatted dates
    createdAt,
    submittedAt,
    updatedAt,
    archivedAt,
    lcidIssuedAt,
    lcidExpiresAt
  };
};
