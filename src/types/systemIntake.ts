import {
  FundingSourceFragmentFragment,
  SystemIntakeCollaboratorInput,
  SystemIntakeContactComponent,
  SystemIntakeContactFragment,
  SystemIntakeContactRole,
  SystemIntakeGRBReviewType,
  SystemIntakeStatusAdmin
} from 'gql/generated/graphql';

import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import SystemIntakeContractStatus from 'constants/enums/SystemIntakeContractStatus';
import SystemIntakeSoftwareAcquisitionMethods from 'constants/enums/SystemIntakeSoftwareAcquisitionMethods';

export type RequestType = 'NEW' | 'MAJOR_CHANGES' | 'RECOMPETE' | 'SHUTDOWN';

/**
 * Type for SystemIntakeForm
 *
 */
export type SystemIntakeForm = {
  id: string;
  euaUserId: string;
  requestName: string;
  statusAdmin: SystemIntakeStatusAdmin;
  requestType: RequestType;
  requester: {
    name: string;
    component: string;
    email: string;
  };
  businessOwner: {
    name: string;
    component: string;
  };
  productManager: {
    name: string;
    component: string;
  };
  governanceTeams: {
    isPresent: boolean | null;
    teams: SystemIntakeCollaboratorInput[];
  };
  businessNeed: string;
  businessSolution: string;
  currentStage: string;
  needsEaSupport: boolean | null;
  usesAiTech: boolean | null;
  hasUiChanges: boolean | null;
  usingSoftware: string | null;
  acquisitionMethods: SystemIntakeSoftwareAcquisitionMethods[] | null;
  grtReviewEmailBody: string;
  decidedAt: string | null;
  businessCaseId?: string | null;
  submittedAt: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  archivedAt: string | null;
  lcid: string;
  lcidExpiresAt: string | null;
  lcidScope: string;
  lcidCostBaseline: string | null;
  decisionNextSteps: string;
  rejectionReason: string;
  grtDate: string | null;
  grbDate: string | null;
  adminLead: string;
  requesterNameAndComponent: string;
} & ContractDetailsForm;

export type ContactDetailsForm = {
  requester: ContactFields;
  businessOwner: ContactFields & { sameAsRequester: boolean };
  productManager: ContactFields & { sameAsRequester: boolean };
  governanceTeams: {
    isPresent: boolean;
    teams: CollaboratorFields;
  };
};

/** Funding source formatted for API */
export type FundingSource = FundingSourceFragmentFragment;

/** Funding source formatted for app */
export type FormattedFundingSource = {
  projectNumber: string | null;
  investments: string[];
};

/** Contract details form */
export type ContractDetailsForm = {
  existingFunding: boolean | null;
  fundingSources: FormattedFundingSource[];
  annualSpending: {
    currentAnnualSpending: string;
    currentAnnualSpendingITPortion: string;
    plannedYearOneSpending: string;
    plannedYearOneSpendingITPortion: string;
  };
  contract: {
    hasContract: SystemIntakeContractStatus | null;
    contractor: string;
    startDate: {
      month: string;
      day: string;
      year: string;
    };
    endDate: {
      month: string;
      day: string;
      year: string;
    };
    numbers: string;
  };
};

export type IntakeNote = {
  id: string;
  author: {
    name: string;
    eua: string;
  };
  content: string;
  createdAt: string;
};

// Redux store type for a system intake
export type SystemIntakeState = {
  systemIntake: SystemIntakeForm;
  isLoading: boolean | null;
  isSaving: boolean;
  isNewIntakeCreated: boolean | null;
  error?: any;
  notes: IntakeNote[];
};

// Redux store type for systems
export type SystemIntakesState = {
  systemIntakes: SystemIntakeForm[];
  isLoading: boolean | null;
  loadedTimestamp: string | null;
  error: string | null;
};

// Form for reviewer to add dates
export type SubmitDatesForm = {
  grtDateDay: string;
  grtDateMonth: string;
  grtDateYear: string;
  grbDateDay: string;
  grbDateMonth: string;
  grbDateYear: string;
  grbReviewType: SystemIntakeGRBReviewType;
};

/** Cedar contact properties */
export type CedarContactProps = {
  euaUserId: string | null;
  commonName: string;
  email?: string;
};

/** System intake governance team field types */

type CmsGovernanceTeams = typeof cmsGovernanceTeams;
type CmsGovernanceTeam = CmsGovernanceTeams[number];

export type CollaboratorFields = Record<
  CmsGovernanceTeam['key'],
  {
    isPresent: boolean;
    collaborator: string;
  }
>;

// TODO EASI-4937 - these types will be removed with useSystemIntakeContacts hook
// in favor of using the actual queries and mutations

export type ContactFields = {
  id?: string | null;
  username: string | null;
  component: SystemIntakeContactComponent | null;
  commonName: string;
  email: string;
};

/** Formatted system intake contacts */
export type FormattedContacts = {
  requester: SystemIntakeContactFragment | null | undefined;
  businessOwner: SystemIntakeContactFragment | null | undefined;
  productManager: SystemIntakeContactFragment | null | undefined;
  additionalContacts: SystemIntakeContactFragment[];
};

export type ContactInputType = ContactFields & {
  isRequester: boolean;
  systemIntakeId: string;
  roles: SystemIntakeContactRole[];
};

/** Function to create system intake contact */
export type CreateContactType = (
  contact: ContactInputType
) => Promise<SystemIntakeContactFragment | null | undefined>;

/** Function to update system intake contact */
export type UpdateContactType = (
  contact: ContactInputType
) => Promise<SystemIntakeContactFragment | null | undefined>;

/** Function to delete system intake contact */
export type DeleteContactType = (
  id: string
) => Promise<FormattedContacts | null | undefined>;

/** useSystemIntakeContacts custom hook return type */
export type UseSystemIntakeContactsType = {
  /** Object containing contacts data and GetSystemIntakeContactsQuery loading state */
  contacts: {
    /** Formatted contacts object */
    data: FormattedContacts | undefined;
    /** GetSystemIntakeContactsQuery loading state */
    loading: boolean;
  };
  /** Creates system intake contact in database */
  createContact: CreateContactType;
  /** Updates system intake contact in database */
  updateContact: UpdateContactType;
  /** Deletes system intake contact from database */
  deleteContact: DeleteContactType;
};
