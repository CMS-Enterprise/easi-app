import { GetSystemIntakeContacts_systemIntakeContacts_systemIntakeContacts as AugmentedSystemIntakeContact } from 'queries/types/GetSystemIntakeContacts';

import { SystemIntakeStatusAdmin } from './graphql-global-types';

export type GovernanceCollaborationTeam = {
  collaborator: string;
  name: string;
  key: string;
};

export const openIntakeStatusesV1 = [
  'INTAKE_DRAFT',
  'INTAKE_SUBMITTED',
  'NEED_BIZ_CASE',
  'BIZ_CASE_DRAFT',
  'BIZ_CASE_DRAFT_SUBMITTED',
  'BIZ_CASE_CHANGES_NEEDED',
  'BIZ_CASE_FINAL_NEEDED',
  'BIZ_CASE_FINAL_SUBMITTED',
  'READY_FOR_GRT',
  'READY_FOR_GRB',
  'SHUTDOWN_IN_PROGRESS'
];

export const closedIntakeStatusesV1 = [
  'LCID_ISSUED',
  'WITHDRAWN',
  'NOT_IT_REQUEST',
  'NOT_APPROVED',
  'NO_GOVERNANCE',
  'SHUTDOWN_COMPLETE'
];

export const intakeStatusesV1 = [
  ...openIntakeStatusesV1,
  ...closedIntakeStatusesV1
] as const;

// TODO: Remove old intake statuses once they're deprecated
export type SystemIntakeStatusV1 = typeof intakeStatusesV1[number];

export type RequestType = 'NEW' | 'MAJOR_CHANGES' | 'RECOMPETE' | 'SHUTDOWN';

/**
 * Type for SystemIntakeForm
 *
 */
export type SystemIntakeForm = {
  id: string;
  euaUserId: string;
  requestName: string;
  status: SystemIntakeStatusV1;
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
  isso: {
    isPresent: boolean | null;
    name: string;
  };
  governanceTeams: {
    isPresent: boolean | null;
    teams: GovernanceCollaborationTeam[];
  };
  businessNeed: string;
  businessSolution: string;
  currentStage: string;
  needsEaSupport: boolean | null;
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
  hasUiChanges: boolean | null;
} & ContractDetailsForm;

export type ContactDetailsForm = {
  requester: SystemIntakeContactProps;
  businessOwner: SystemIntakeContactProps;
  productManager: SystemIntakeContactProps;
  isso: SystemIntakeContactProps & { isPresent: boolean };
  governanceTeams: {
    isPresent: boolean | null;
    teams:
      | {
          collaborator: string;
          key: string;
          name: string;
        }[]
      | null;
  };
};

/** Single funding source */
export type FundingSource = {
  source: string | null;
  fundingNumber: string | null;
};

/** Funding sources formatted for form */
export type MultiFundingSource = {
  fundingNumber: string;
  sources: string[];
};

/** Funding sources formatted for form */
export interface ExistingFundingSource extends MultiFundingSource {
  initialFundingNumber: string;
}

/** Funding sources object formatted for display */
export type FormattedFundingSourcesObject = {
  [number: string]: {
    fundingNumber: string;
    sources: string[];
  };
};

/** Add, edit, or delete funding source */
export type UpdateFundingSources =
  | {
      action: 'Add' | 'Delete';
      data: MultiFundingSource;
    }
  | {
      action: 'Edit';
      data: ExistingFundingSource;
    };

/** Update active funding source in form */
export type UpdateActiveFundingSource = {
  action: 'Add' | 'Edit' | null;
  data?: MultiFundingSource;
};

/** useIntakeFundingSources hook return type */
export type UseIntakeFundingSources = {
  fundingSources: [
    fundingSources: FormattedFundingSourcesObject,
    updateFundingSources: ({ action, data }: UpdateFundingSources) => void
  ];
  activeFundingSource: [
    activeFundingSource: MultiFundingSource,
    updateActiveFundingSource: (payload: UpdateActiveFundingSource) => void,
    action: 'Add' | 'Edit' | null
  ];
};

/** Contract details form */
export type ContractDetailsForm = {
  existingFunding: boolean | null;
  fundingSources: FundingSource[] | [];
  annualSpending: {
    currentAnnualSpending: string;
    currentAnnualSpendingITPortion: string;
    plannedYearOneSpending: string;
    plannedYearOneSpendingITPortion: string;
  };
  contract: {
    hasContract: string;
    contractor: string;
    number: string;
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
};

/** Cedar contact properties */
export type CedarContactProps = {
  euaUserId: string;
  commonName: string;
  email?: string;
};

/** System intake contact properties */
export type SystemIntakeContactProps = {
  id?: string | null;
  euaUserId: string;
  systemIntakeId: string;
  component: string;
  role: string;
  commonName: string;
  email: string;
};

/** Formatted system intake contacts */
export type FormattedContacts = {
  requester: SystemIntakeContactProps;
  businessOwner: SystemIntakeContactProps;
  productManager: SystemIntakeContactProps;
  isso: SystemIntakeContactProps;
  additionalContacts: SystemIntakeContactProps[];
};

/** Function to create system intake contact */
export type CreateContactType = (
  contact: SystemIntakeContactProps
) => Promise<AugmentedSystemIntakeContact | undefined>;

/** Function to update system intake contact */
export type UpdateContactType = (
  contact: SystemIntakeContactProps
) => Promise<AugmentedSystemIntakeContact | undefined>;

/** Function to delete system intake contact */
export type DeleteContactType = (
  id: string
) => Promise<FormattedContacts | undefined>;

/** useSystemIntakeContacts custom hook return type */
export type UseSystemIntakeContactsType = {
  /** Object containing contacts data and GetSystemIntakeContactsQuery loading state */
  contacts: {
    /** Formatted contacts object */
    data: FormattedContacts;
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

/** System intake contact role keys */
export type SystemIntakeRoleKeys =
  | 'businessOwner'
  | 'productManager'
  | 'isso'
  | 'requester';
